<script lang="ts">
	import { fly } from 'svelte/transition'
	import { cubicInOut } from 'svelte/easing'
	import { toText } from './date-utils.js'
	import type { Locale } from './locale.js'
	import { parse, createFormat, type FormatToken } from './parse.js'
	import DateTimePicker from './DatePicker.svelte'
	import { writable } from 'svelte/store'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher<{
		/** Fires when the user selects a new value in the DatePicker by clicking on a date or by pressing enter */
		select: Date
	}>()

	/** Default date to display in picker before value is assigned */
	const defaultDate = new Date()

	function cloneDate(d: Date) {
		return new Date(d.getTime())
	}

	// inner date value store for preventing value updates (and also
	// text updates as a result) when date is unchanged
	const innerStore = writable(null as Date | null)
	const store = (() => {
		return {
			subscribe: innerStore.subscribe,
			set: (date: Date | null) => {
				if (date === null || date === undefined) {
					innerStore.set(null)
					value = date
				} else if (date.getTime() !== $innerStore?.getTime()) {
					innerStore.set(cloneDate(date))
					value = date
				}
			},
		}
	})()

	/** Date value */
	export let value: Date | null = null
	$: store.set(value)

	/** The earliest value the user can select */
	export let min = new Date(defaultDate.getFullYear() - 20, 0, 1)
	/** The latest value the user can select */
	export let max = new Date(defaultDate.getFullYear(), 11, 31, 23, 59, 59, 999)
	/** Set the input element's ID attribute */
	export let id: string | null = null
	/** Placeholder text to show when input field is empty */
	export let placeholder = '2020-12-31 23:00:00'
	/** Whether the text is valid */
	export let valid = true
	/** Disable the input **/
	export let disabled = false
	/** Require a value to submit form **/
	export let required = false
	/** Pass custom classes */
	let classes = ''
	export { classes as class }

	/** Locale object for internationalization */
	export let locale: Locale = {}

	/** Format string */
	export let format = 'yyyy-MM-dd HH:mm:ss'
	let formatTokens = createFormat(format, locale)
	$: formatTokens = createFormat(format, locale)

	function valueUpdate(value: Date | null, formatTokens: FormatToken[]) {
		text = toText(value, formatTokens)
	}
	$: valueUpdate($store, formatTokens)

	export let text = toText($store, formatTokens)

	function textUpdate(text: string, formatTokens: FormatToken[]) {
		if (text.length) {
			const result = parse(text, formatTokens, $store)
			if (result.date !== null) {
				valid = true
				store.set(result.date)
			} else {
				valid = false
			}
		} else {
			valid = true // <-- empty string is always valid
			// value resets to null if you clear the field
			if (value) {
				value = null
				store.set(null)
			}
		}
	}
	$: textUpdate(text, formatTokens)

	/** Whether the date popup is visible */
	export let visible = false
	/** Close the date popup when a date is selected */
	export let closeOnSelection = false
	/** Wait with updating the date until a date is selected */
	export let browseWithoutSelecting = false

	/** Show a time picker with the specified precision */
	export let timePrecision: 'minute' | 'second' | 'millisecond' | null = null

	// handle on:focusout for parent element. If the parent element loses
	// focus (e.g input element), visible is set to false
	function onFocusOut(e: FocusEvent) {
		if (
			e?.currentTarget instanceof HTMLElement &&
			e.relatedTarget &&
			e.relatedTarget instanceof Node &&
			e.currentTarget.contains(e.relatedTarget)
		) {
			return
		} else {
			visible = false
		}
	}
	function keydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && visible) {
			visible = false
			e.preventDefault()
			// When the date picker is open, we prevent 'Escape' from propagating,
			// so for example a parent modal won't be closed
			e.stopPropagation()
		} else if (e.key === 'Enter') {
			visible = !visible
			e.preventDefault()
		}
	}

	function onSelect(e: CustomEvent<Date>) {
		dispatch('select', e.detail)
		if (closeOnSelection) {
			visible = false
		}
	}

	/** Automatically adjust date popup position to not appear outside the screen */
	export let dynamicPositioning = false

	let InputElement: HTMLInputElement
	let pickerElement: HTMLElement | null
	let showAbove = false
	let pickerLeftPosition: number | null = null

	function setDatePickerPosition() {
		// Defaults
		showAbove = false
		pickerLeftPosition = null

		if (visible && pickerElement && dynamicPositioning) {
			// The child of the dateField is what is visually seen, all calculations should use this to make sure they line up properly
			const inputRect = InputElement.getBoundingClientRect()
			const horizontalOverflow = pickerElement.offsetWidth - inputRect.width

			const bottomThreshold = inputRect.bottom + pickerElement.offsetHeight + 5
			const rightThreshold = inputRect.left + pickerElement.offsetWidth + 5

			if (bottomThreshold > window.innerHeight) {
				// If .date-time-field is on the bottom half of the screen, open above
				showAbove = true
			}
			if (rightThreshold > window.innerWidth) {
				// If date-time-field is on the right of the screen, open to the left
				pickerLeftPosition = -horizontalOverflow

				if (inputRect.left < horizontalOverflow + 5) {
					// If it would overflow on the left too, open in the middle of the screen
					const windowCenterPos = window.innerWidth / 2
					const newPos = windowCenterPos - pickerElement.offsetWidth / 2
					pickerLeftPosition = newPos - inputRect.left
				}
			}
		}
	}

	function flyAutoPosition(node: HTMLElement) {
		setDatePickerPosition()
		return fly(node, {
			duration: 200,
			easing: cubicInOut,
			y: showAbove ? 5 : -5,
		})
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="date-time-field {classes}" on:focusout={onFocusOut} on:keydown={keydown}>
	<input
		bind:this={InputElement}
		class:invalid={!valid}
		type="text"
		autocomplete="off"
		value={text}
		{id}
		{placeholder}
		{disabled}
		{required}
		on:focus={() => (visible = true)}
		on:mousedown={() => (visible = true)}
		on:input={(e) => {
			if (
				e instanceof InputEvent &&
				e.inputType === 'insertText' &&
				typeof e.data === 'string' &&
				e.currentTarget.value === text + e.data
			) {
				// check for missing punctuation, and add if there is any
				let result = parse(text, formatTokens, $store)
				if (result.missingPunctuation !== '' && !result.missingPunctuation.startsWith(e.data)) {
					text = text + result.missingPunctuation + e.data
					return
				}
			}
			text = e.currentTarget.value
		}}
	/>
	{#if visible && !disabled}
		<div
			class="picker"
			class:visible
			class:above={showAbove}
			transition:flyAutoPosition
			bind:this={pickerElement}
			style:--picker-left-position="{pickerLeftPosition}px"
		>
			<DateTimePicker
				on:focusout={onFocusOut}
				on:select={onSelect}
				bind:value={$store}
				{min}
				{max}
				{locale}
				{browseWithoutSelecting}
				{timePrecision}
			>
				<slot />
			</DateTimePicker>
		</div>
	{/if}
</div>

<style lang="sass">
	.date-time-field
		position: relative
	input
		color: var(--date-picker-foreground, #000000)
		background: var(--date-picker-background, #ffffff)
		min-width: 0px
		box-sizing: border-box
		padding: 4px 6px
		margin: 0px
		border: 1px solid rgba(103, 113, 137, 0.3)
		border-radius: 3px
		width: var(--date-input-width, 150px)
		outline: none
		transition: all 80ms cubic-bezier(0.4, 0.0, 0.2, 1)
		&:focus
			border-color: var(--date-picker-highlight-border, #0269f7)
			box-shadow: 0px 0px 0px 2px var(--date-picker-highlight-shadow, rgba(#0269f7, 0.4))
		&:disabled
			opacity: 0.5
	.invalid
		border: 1px solid rgba(#f92f72, 0.5)
		background-color: rgba(#f92f72, 0.1)
		&:focus
			border-color: #f92f72
			box-shadow: 0px 0px 0px 2px rgba(#f92f72, 0.5)
	.picker
		display: none
		position: absolute
		padding: 1px
		&.above
			bottom: 100%
		left: var(--picker-left-position)
		z-index: 10
		&.visible
			display: block
</style>
