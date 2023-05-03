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
    select: undefined
  }>()

  /** Default date to display in picker before value is assigned */
  const defaultDate = new Date()

  // inner date value store for preventing value updates (and also
  // text updates as a result) when date is unchanged
  const innerStore = writable(null as Date | null)
  const store = (() => {
    return {
      subscribe: innerStore.subscribe,
      set: (d: Date | null) => {
        if (d === null) {
          innerStore.set(null)
          value = d
        } else if (d.getTime() !== $innerStore?.getTime()) {
          innerStore.set(d)
          value = d
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
  /** Placeholder text to show when input field is empty */
  export let placeholder = '2020-12-31 23:00:00'
  /** Whether the text is valid */
  export let valid = true
  /** Disable the input **/
  export let disabled = false
  /** Pass custom classes */
  let classes = ''
  export { classes as class }

  /** Format string */
  export let format = 'yyyy-MM-dd HH:mm:ss'
  let formatTokens = createFormat(format)
  $: formatTokens = createFormat(format)

  /** Locale object for internationalization */
  export let locale: Locale = {}

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

  function onSelect(e: CustomEvent<undefined>) {
    dispatch('select', e.detail)
    if (closeOnSelection) {
      visible = false
    }
  }
</script>

<div class="date-time-field {classes}" on:focusout={onFocusOut} on:keydown={keydown}>
  <input
    class:invalid={!valid}
    type="text"
    value={text}
    {placeholder}
    {disabled}
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
    <div class="picker" class:visible transition:fly={{ duration: 80, easing: cubicInOut, y: -5 }}>
      <DateTimePicker
        on:focusout={onFocusOut}
        on:select={onSelect}
        bind:value={$store}
        {min}
        {max}
        {locale}
        {browseWithoutSelecting}
      />
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
    margin-top: 1px
    z-index: 10
    &.visible
      display: block
</style>
