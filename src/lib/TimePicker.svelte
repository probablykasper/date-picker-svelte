<script lang="ts">
  /**
   * Refactor neeeded.
   */

  import { browser } from '$app/environment'
  import { milliseconds } from 'date-fns'

  export let browseDate: Date
  export let timePrecision: null | 'minute' | 'second' | 'millisecond'
  export let browse: Function

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
  /**
   * Need a better and cleaner implementation for navgiation,
   * possibly using a circular datastructure
   */
  const getSiblings = () => {
    const type = timePickerActiveField?.dataset.timePickerType
    let next, prev
    if (type == 'minute') {
      prev = hourInput
      next = secondInput
    } else if (type == 'second') {
      next = millisecondInput
      prev = minuteInput
    } else if (type == 'millisecond') {
      prev = secondInput
    } else if (type == 'hour') {
      next = minuteInput
    }
    return [next, prev]
  }
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

  function timePickerKeydown(e: KeyboardEvent) {
    e.preventDefault()
    const keysToMoveNext = Array.from(';:-,.').concat(['ArrowRight', 'Tab'])
    const [next, prev] = getSiblings()
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
      console.log('increase', increaseStrNumber(timePickerState))
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
  {timePrecision}

  {#if timePrecision != null}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="timepicker" on:keydown={timePickerKeydown}>
      <input
        bind:this={hourInput}
        on:focus={setTimePickerActiveField}
        aria-label="hours (24hr clock)"
        data-time-picker-type="hour"
        type="number"
        class="timepicker-input timepicker-hour"
        id="hour24-input-0"
        min="0"
        max="23"
        value="00"
      /><span class="timepicker-divider-text">:</span><input
        on:focus={setTimePickerActiveField}
        aria-label="minutes"
        bind:this={minuteInput}
        value="00"
        data-time-picker-type="minute"
        type="number"
        min="0"
        max="59"
        class="timepicker-input timepicker-minute"
        id="minute-input-0"
      />
      {#if timePrecision == 'second' || timePrecision == 'millisecond'}
        <span class="timepicker-divider-text">:</span><input
          on:focus={setTimePickerActiveField}
          aria-label="minutes"
          bind:this={secondInput}
          data-time-picker-type="second"
          value="00"
          type="number"
          min="0"
          max="59"
          class="timepicker-input timepicker-minute"
          id="minute-input-0"
        />
      {/if}
      {#if timePrecision == 'millisecond'}
        <span class="timepicker-divider-text">:</span><input
          on:focus={setTimePickerActiveField}
          aria-label="minutes"
          data-time-picker-type="millisecond"
          bind:this={millisecondInput}
          value="00"
          type="number"
          min="0"
          max="1000"
          class="timepicker-input timepicker-minute"
          id="minute-input-0"
        />
      {/if}
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
