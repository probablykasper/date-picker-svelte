<script lang="ts">
  /**
   * Refactor neeeded.
   */
  import { browser } from '$app/environment'
  const TimePrecision = ['hour', 'minute', 'second', 'millisecond']
  const INPUT_SELECTOR_CLS = 'timepicker-input'
  interface TimeInputField {
    type: (typeof TimePrecision)[number]
    min: number
    max: number
    inputField?: HTMLInputElement | undefined
  }

  interface T {
    [key: (typeof TimePrecision)[number]]: TimeInputField
  }

  function getRequiredFields(
    precision: (typeof TimePrecision)[number] | null
  ): Array<TimeInputField> | undefined {
    if (!precision) {
      return
    }
    return TimePrecision.slice(0, TimePrecision.indexOf(precision) + 1).map((type) => ({
      type,
      min: 0,
      max: type === 'hour' ? 23 : type === 'millisecond' ? 1000 : 59,
      inputField: undefined,
    }))
  }
  export let browseDate: Date
  export let timePrecision: null | 'minute' | 'second' | 'millisecond'
  export let browse: Function
  const requiredFields = getRequiredFields(timePrecision)
  console.log(requiredFields)

  let hourInput: HTMLInputElement
  let minuteInput: HTMLInputElement
  let secondInput: HTMLInputElement
  let millisecondInput: HTMLInputElement

  let timePickerActiveField: null | HTMLInputElement
  $: timePickerActiveField = null

  $: timePickerState = ''

  function setTimePickerActiveField(e: Event) {
    if (e.target instanceof HTMLInputElement) {
      timePickerActiveField = e.target
    }
  }
  function setInitilState(el: typeof timePickerActiveField) {
    if (el) {
      timePickerState = el.value == '00' ? '' : el.value
    }
  }

  $: {
    setInitilState(timePickerActiveField)
  }
  let container: HTMLDivElement
  function isDigitKey(key: string) {
    var digitPattern = /^[0-9]$/
    return digitPattern.test(key)
  }

  const rangeFn = {
    minute: (m: number) => m >= 0 && m <= 59,
    second: (s: number) => s >= 0 && s <= 59,
    hour: (m: number) => m >= 0 && m <= 23,
    millisecond: (n: number) => n >= 0 && n <= 999,
  }

  function setTimePickerState(key: string) {
    const digit = parseInt(key, 10)
    const type = timePickerActiveField?.dataset.timePickerType

    if (type && Object.keys(rangeFn).includes(type) && rangeFn[type](digit)) {
      timePickerState = key
    }
  }

  function setHours(newHour: number | typeof NaN) {
    if (rangeFn['hour'](newHour)) {
      hourInput.value = `${newHour < 10 ? '0' : ''}${newHour}`
      browseDate.setHours(newHour)
      browse(browseDate)
    }
  }

  function setMinutes(newMinute: number) {
    if (rangeFn['minute'](newMinute)) {
      minuteInput.value = `${newMinute < 10 ? '0' : ''}${newMinute}`

      browseDate.setMinutes(newMinute)
      browse(browseDate)
    }
  }
  function setSeconds(d: number) {
    if (rangeFn['second'](d)) {
      secondInput.value = `${d < 10 ? '0' : ''}${d}`

      browseDate.setSeconds(d)
      browse(browseDate)
    }
  }
  function setMilliseconds(t: number) {
    if (rangeFn['millisecond'](t)) {
      millisecondInput.value = `${t < 10 ? '0' : ''}${t}`

      browseDate.setMilliseconds(t)
      browse(browseDate)
    }
  }
  function setTime(value: string) {
    const valueInt = value == '' ? 0 : parseInt(value, 10)
    const type = timePickerActiveField?.dataset.timePickerType

    if (hourInput && timePickerActiveField == hourInput) {
      setHours(valueInt)
    } else if (minuteInput && timePickerActiveField == minuteInput) {
      setMinutes(valueInt)
    } else if (secondInput && timePickerActiveField == secondInput) {
      setSeconds(valueInt)
    } else if (millisecondInput && timePickerActiveField == millisecondInput) {
      setMilliseconds(valueInt)
    }
  }

  $: {
    if (browser) {
      setTime(timePickerState)
    }
  }

  function increaseStrNumber(str: string) {
    if (str === '') {
      return '1'
    } else {
      const number = parseInt(str, 10)
      const incrementedNumber = number + 1
      return String(incrementedNumber)
    }
  }

  function decreaseStrNumber(str: string) {
    if (str === '' || str === '0') {
      return '0'
    } else {
      const number = parseInt(str, 10)
      const decrementedNumber = number - 1
      return String(decrementedNumber)
    }
  }
  function getSiblings() {
    const elementIndex = parseInt(timePickerActiveField?.dataset.index as string, 10)

    return {
      next:
        requiredFields && requiredFields.length - 1 > elementIndex
          ? requiredFields[elementIndex + 1].inputField
          : undefined,
      prev:
        requiredFields && elementIndex > 0
          ? requiredFields[elementIndex - 1].inputField
          : undefined,
    }
  }

  function timePickerKeydown(e: KeyboardEvent) {
    e.preventDefault()
    const keysToMoveNext = Array.from(';:-,.').concat(['ArrowRight', 'Tab'])
    const { next, prev } = getSiblings()
    if (keysToMoveNext.includes(e.key) && !(e.shiftKey && e.key == 'Tab')) {
      if (next) {
        next.focus()
      }
    } else if ((e.key == 'Tab' && e.shiftKey) || e.key == 'ArrowLeft') {
      if (prev) {
        prev.focus()
      }
    }

    if (isDigitKey(e.key)) {
      setTimePickerState(timePickerState + e.key)
    } else if (e.key == 'ArrowUp') {
      setTimePickerState(increaseStrNumber(timePickerState))
    } else if (e.key == 'ArrowDown') {
      setTimePickerState(decreaseStrNumber(timePickerState))
    }

    if (e.key == 'Backspace' && timePickerState != '') {
      timePickerState = timePickerState.slice(0, -1)
    }
  }
</script>

<div>
  {#if timePrecision != null && requiredFields != undefined}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="timepicker" on:keydown={timePickerKeydown} bind:this={container}>
      {#each requiredFields as field, i}
        {#if i != 0}
          <span class="timepicker-divider-text">:</span>
        {/if}
        <input
          bind:this={field.inputField}
          on:focus={setTimePickerActiveField}
          aria-label={field.type}
          data-type={field.type}
          data-index={i}
          type="number"
          class={INPUT_SELECTOR_CLS}
          id="{field.type}-input-{i}"
          min={field.min}
          max={field.max}
          value="00"
        />
      {/each}
    </div>
  {/if}
</div>

<style lang="sass">
  .timepicker
    display: flex
    justify-content: center
    align-items: center
    margin-block:0.5rem
    padding: 1px
    width: fit-content
    margin-inline: auto
    border: 1px solid rgba(108, 120, 147, 0.3)
    border-radius: 5px
    .timepicker-divider-text
      padding-inline:2px
    .timepicker-input
      max-width:1.5rem
      width: fit-content
      border: none
      outline: none
      height: auto
      -moz-appearance: textfield
      font-family: inherit
      text-align: center
      caret-color: transparent
      &:focus-visible
        outline: none
        background-color: rgba(#808080, 0.08)
      &::input::-webkit-outer-spin-button, &::input::-webkit-outer-spin-button
        -webkit-appearance: none
        margin: 0
</style>
