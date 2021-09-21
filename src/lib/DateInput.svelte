<script lang="ts">
  import { toText } from './date-utils'
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
  /** Input field width */
  export let width = '140px'

  /** Format string */
  export let format = 'yyyy-MM-dd HH:mm:ss'
  let formatTokens = createFormat(format)
  $: formatTokens = createFormat(format)

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
      e.relatedTarget instanceof HTMLElement &&
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
    on:input={input}
    style={`width: ${width}`} />
  <div class="picker" class:visible>
    <DateTimePicker on:focusout={onFocusOut} bind:value bind:min bind:max />
  </div>
</div>

<style lang="sass">
  .date-time-field
    position: relative
  input
    min-width: 0px
    box-sizing: border-box
    padding: 4px 6px
    margin: 0px
    font-size: 0.75em
    font-family: inherit
    border: 1px solid #c6cddd
    border-radius: 3px
    width: 130px
  .invalid
    border: 1px solid rgba(#f92f72, 0.5)
    background-color: #fff0f5
  .picker
    display: none
    position: absolute
    margin-top: 1px
    background-color: #ffffff
    z-index: 10
    &.visible
      display: block
</style>
