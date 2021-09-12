<script lang="ts">
  import { toText } from './date-utils'
  import { parse, createFormat } from './parse'
  import type { FormatToken } from './parse'
  import DateTimePicker from './DatePicker.svelte'

  export let width = '140px'
  export let placeholder = '2020-12-31 23:00:00'
  export let value = new Date()
  export let valid = true
  export let years = [2018, 2019, 2020, 2021]

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
    const result = parse(text, formatTokens)
    if (result.date !== null) {
      valid = true
      value = result.date
    } else {
      valid = false
    }
  }
  $: textUpdate(text, formatTokens)

  function input(e: any) {
    if (e.inputType === 'insertText' && text === textHistory[0] + e.data) {
      let result = parse(textHistory[0], formatTokens)
      if (result.missingPunctuation !== '' && !result.missingPunctuation.startsWith(e.data)) {
        text = textHistory[0] + result.missingPunctuation + e.data
      }
    }
  }

  export let visible = false
  let dateTimePicker: DateTimePicker
  function onFocusOut(e: FocusEvent) {
    dateTimePicker.onFocusOut(e)
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
    <DateTimePicker bind:this={dateTimePicker} bind:value bind:visible bind:years />
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
    &.visible
      display: block
</style>
