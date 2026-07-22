<script lang="ts">
	interface Props {
		browseDate: Date
		timePrecision: 'minute' | 'second' | 'millisecond' | null
		setTime: (d: Date) => Date
	}
	let { browseDate = $bindable(), timePrecision, setTime }: Props = $props()

	let fields: (HTMLSpanElement | undefined | null)[] = $state([])
	function select(node: Node) {
		const selection = window.getSelection()
		const range = document.createRange()
		range.selectNodeContents(node)
		selection?.removeAllRanges()
		selection?.addRange(range)
	}

	type SpanEvent = { currentTarget: EventTarget & HTMLSpanElement }
	function keydown(e: KeyboardEvent & SpanEvent) {
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			const value = getValue(e.currentTarget)
			const delta = e.key === 'ArrowUp' ? 1 : -1
			setValue(e.currentTarget, value + delta, true)
			e.preventDefault()
			select(e.currentTarget)
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || ':;-,.'.includes(e.key)) {
			const fieldIndex = fields.indexOf(e.currentTarget)
			const delta = e.key === 'ArrowLeft' ? -1 : 1
			const el = fields[fieldIndex + delta]
			e.preventDefault()
			if (el) {
				el.focus()
				select(el)
			}
		}
	}

	function getValue(node: HTMLElement) {
		const label = getField(node).label
		if (label === 'Hours') {
			return browseDate.getHours()
		} else if (label === 'Minutes') {
			return browseDate.getMinutes()
		} else if (label === 'Seconds') {
			return browseDate.getSeconds()
		} else {
			return browseDate.getMilliseconds()
		}
	}
	function clamp(value: number, max: number, loopAround: boolean) {
		if (loopAround && value < 0) {
			return max
		} else if (loopAround && value > max) {
			return 0
		} else {
			return Math.max(0, Math.min(max, value))
		}
	}

	function getField(element: HTMLElement) {
		const label = element.getAttribute('aria-label')
		if (label === 'Hours') {
			return { label, len: 2, max: 23 } as const
		} else if (label === 'Minutes') {
			return { label, len: 2, max: 59 } as const
		} else if (label === 'Seconds') {
			return { label, len: 2, max: 59 } as const
		} else if (label === 'Milliseconds') {
			return { label, len: 3, max: 999 } as const
		} else {
			throw new Error('Invalid label ' + label)
		}
	}

	$effect(() => {
		setText(browseDate)
	})
	function setText(d: Date) {
		const hours = ('00' + d.getHours()).slice(-2)
		const minutes = ('00' + d.getMinutes()).slice(-2)
		const seconds = ('00' + d.getSeconds()).slice(-2)
		const milliseconds = ('000' + d.getMilliseconds()).slice(-3)
		if (fields[0] && fields[0].innerText !== hours) {
			fields[0].innerText = hours
		}
		if (fields[1] && fields[1].innerText !== minutes) {
			fields[1].innerText = minutes
		}
		if (fields[2] && fields[2].innerText !== seconds) {
			fields[2].innerText = seconds
		}
		if (fields[3] && fields[3].innerText !== milliseconds) {
			fields[3].innerText = milliseconds
		}
	}

	function setValue(node: HTMLElement, value: number, loopAround = false) {
		const field = getField(node)
		value = clamp(value, field.max, loopAround)
		if (field.label === 'Hours') {
			browseDate.setHours(value)
		} else if (field.label === 'Minutes') {
			browseDate.setMinutes(value)
		} else if (field.label === 'Seconds') {
			browseDate.setSeconds(value)
		} else if (field.label === 'Milliseconds') {
			browseDate.setMilliseconds(value)
		}

		browseDate = setTime(browseDate)
		setText(browseDate)
	}

	function parse(text: string, length: number) {
		return parseInt(text.replace(/[^\d]/g, '').slice(-length))
	}

	function input(eUnknown: unknown) {
		const e = eUnknown as InputEvent & SpanEvent // type error workaround

		const field = getField(e.currentTarget)
		let newValue: number

		if (e.inputType === 'insertText') {
			const originalText = '000' + getValue(e.currentTarget)
			newValue = parse(originalText + e.currentTarget.innerText, field.len)
			if (newValue > field.max && e.data) {
				newValue = parse(e.data, field.len)
			}
		} else {
			newValue = parse('000' + e.currentTarget.innerText, field.len)
		}

		setValue(e.currentTarget, newValue)
		select(e.currentTarget)
	}

	function focus(e: FocusEvent & SpanEvent) {
		select(e.currentTarget)
	}
</script>

{#if timePrecision}
	<div
		class="time-picker"
		role="none"
		onmousedown={(e) => {
			if (e.target instanceof HTMLElement && e.target.tagName === 'SPAN') {
				e.target.focus()
				e.preventDefault() // prevent text dragging
			}
		}}
	>
		<span
			bind:this={fields[0]}
			role="spinbutton"
			aria-label="Hours"
			tabindex="0"
			contenteditable
			inputmode="numeric"
			onkeydown={keydown}
			oninput={input}
			onfocus={focus}>{('00' + browseDate.getHours()).slice(-2)}</span
		>:
		<span
			bind:this={fields[1]}
			role="spinbutton"
			aria-label="Minutes"
			tabindex="0"
			contenteditable
			inputmode="numeric"
			onkeydown={keydown}
			oninput={input}
			onfocus={focus}>{('00' + browseDate.getMinutes()).slice(-2)}</span
		>
		{#if timePrecision !== 'minute'}
			:<span
				bind:this={fields[2]}
				role="spinbutton"
				aria-label="Seconds"
				tabindex="0"
				contenteditable
				inputmode="numeric"
				onkeydown={keydown}
				oninput={input}
				onfocus={focus}>{('00' + browseDate.getSeconds()).slice(-2)}</span
			>
			{#if timePrecision !== 'second'}
				.<span
					bind:this={fields[3]}
					role="spinbutton"
					aria-label="Milliseconds"
					tabindex="0"
					contenteditable
					inputmode="numeric"
					onkeydown={keydown}
					oninput={input}
					onfocus={focus}>{('000' + browseDate.getMilliseconds()).slice(-3)}</span
				>
			{/if}
		{/if}
	</div>
{/if}

<style lang="sass">
	.time-picker
		font-size: 1.1em
		display: flex
		align-items: center
		width: fit-content
		border: 1px solid rgba(108, 120, 147, 0.3)
		border-radius: 3px
		margin: auto
		font-variant-numeric: tabular-nums
		margin-top: 6px
	span
		user-select: all
		outline: none
		position: relative
		z-index: 1
		padding: 4px 0px
		&:not(:focus-visible)::selection
			background-color: transparent
		&:first-child
			padding-left: 6px
		&:last-child
			padding-right: 6px
</style>
