<script lang="ts">
  import { fly } from 'svelte/transition'
  import { cubicInOut } from 'svelte/easing'
  import { toText, defaultLocale } from './date-utils'
  import type { Locale } from './date-utils'
  import { parse, createFormat } from './parse'
  import type { FormatToken } from './parse'
  import DateTimePicker from './DatePicker.svelte'

  /** Date value */
  export let value = new Date()
  function setValue(d: Date) {
    if (d.getTime() !== value.getTime()) value = d
  }
  /** The earliest value the user can select */
  export let min = new Date(new Date().getFullYear() - 20, 0, 1)
  /** The latest value the user can select */
  export let max = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999)
  /** Placeholder text to show when input field is empty */
  export let placeholder = '2020-12-31 23:00:00'
  /** Whether the text is valid */
  export let valid = true

  /** Format string */
  export let format = 'yyyy-MM-dd HH:mm:ss'
  let formatTokens = createFormat(format)
  $: formatTokens = createFormat(format)

  /** Locale object for internationalization */
  export const locale: Locale = defaultLocale

  function valueUpdate(value: Date, formatTokens: FormatToken[]) {
    text = toText(value, formatTokens)
  }
  $: valueUpdate(value, formatTokens)

  export let text = toText(value, formatTokens)
  let textHistory = [text, text]
  $: textHistory = [textHistory[1], text]

  function textUpdate(text: string, formatTokens: FormatToken[]) {
    const result = parse(text, formatTokens, value)
    if (result.date !== null) {
      valid = true
      setValue(result.date)
    } else {
      valid = false
    }
  }
  $: textUpdate(text, formatTokens)

  function input(e: any) {
    if (e.inputType === 'insertText' && text === textHistory[0] + e.data) {
      let result = parse(textHistory[0], formatTokens, value)
      if (result.missingPunctuation !== '' && !result.missingPunctuation.startsWith(e.data)) {
        text = textHistory[0] + result.missingPunctuation + e.data
      }
    }
  }

  /** Whether the date popup is visible */
  export let visible = false
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
</script>

<div class="date-time-field" on:focusout={onFocusOut}>
  <input
    class:invalid={!valid}
    type="text"
    bind:value={text}
    {placeholder}
    on:focus={() => (visible = true)}
    on:input={input} />
  {#if visible}
    <div class="picker" class:visible transition:fly={{ duration: 80, easing: cubicInOut, y: -5 }}>
      <DateTimePicker on:focusout={onFocusOut} bind:value bind:min bind:max />
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
