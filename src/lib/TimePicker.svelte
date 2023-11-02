<script lang="ts">
  import { browser } from '$app/environment'
  const TimePrecision = ['hour', 'minute', 'second', 'millisecond']
  const INPUT_SELECTOR_CLS = 'timepicker-input'
  interface TimeInputField {
    type: (typeof TimePrecision)[number]
    min: number
    max: number
    inputField?: HTMLInputElement | undefined
    update: (n: number) => void
  }

  interface T {
    [key: (typeof TimePrecision)[number]]: TimeInputField
  }
  const minmax = (min: number, max: number, i: number) => i >= min && i <= max

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
      update(m: number) {
        const withinLimit = minmax(this.min, this.max, m)
        if (!withinLimit && !this.inputField) {
          return
        }

        ;(this.inputField as unknown as HTMLInputElement).value = `${m < 10 ? '0' : ''}${m}`
        if (this.type == 'hour') {
          browseDate.setHours(m)
        } else if (this.type == 'minute') {
          browseDate.setMinutes(m)
        } else if (this.type == 'second') {
          browseDate.setSeconds(m)
        } else if (this.type == 'milliseconds') {
          browseDate.setMilliseconds(m)
        }

        browse(browseDate)
      },
    }))
  }
  export let browseDate: Date
  export let timePrecision: null | 'minute' | 'second' | 'millisecond'
  export let browse: Function
  const requiredFields = getRequiredFields(timePrecision)
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
    if (!timePickerActiveField) {
      return
    }
    const digit = parseInt(key, 10)
    const min = parseInt(timePickerActiveField?.min, 10)
    const max = parseInt(timePickerActiveField?.max, 10)
    if (minmax(min, max, digit)) {
      timePickerState = key
    }
  }
  function setTime(
    value: string,
    inputField: HTMLInputElement,
    inputFieldsList: Array<TimeInputField>
  ) {
    const index = parseInt(inputField.dataset.index as string, 0)
    const valueInt = value == '' ? 0 : parseInt(value, 10)
    inputFieldsList[index].update(valueInt)
  }

  $: {
    if (browser && timePickerActiveField && requiredFields) {
      setTime(timePickerState, timePickerActiveField, requiredFields)
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
