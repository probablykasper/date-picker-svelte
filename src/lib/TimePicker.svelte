<script lang="ts">
  import { browser } from '$app/environment'

  const TimePrecision = ['hour', 'minute', 'second', 'millisecond']
  type PossibleTimeInputFields = (typeof TimePrecision)[number]

  interface TimeInputField {
    type: PossibleTimeInputFields
    min: number
    max: number
    inputField?: HTMLInputElement | undefined
    update: (n: number) => void
  }

  export let browseDate: Date
  export let timePrecision: null | 'minute' | 'second' | 'millisecond'
  export let browse: Function

  const INPUT_SELECTOR_CLS = 'timepicker-input'
  let timePickerActiveField: undefined | HTMLInputElement
  $: timePickerActiveField = undefined

  $: timePickerState = ''

  interface T {
    [key: PossibleTimeInputFields]: TimeInputField
  }
  const minmax = (min: number, max: number, i: number) => i >= min && i <= max
  function isDigitKey(key: string) {
    var digitPattern = /^[0-9]$/
    return digitPattern.test(key)
  }

  function getRequiredFields(precision: PossibleTimeInputFields): Array<TimeInputField> {
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
        } else if (this.type == 'millisecond') {
          browseDate.setMilliseconds(m)
        }

        browse(browseDate)
      },
    }))
  }

  const REQUIED_FIELDS =
    timePrecision == null || !TimePrecision.includes(timePrecision)
      ? []
      : getRequiredFields(timePrecision)

  function setInitilState(el: typeof timePickerActiveField) {
    if (el) {
      timePickerState = el.value == '00' ? '' : el.value
    }
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
    setInitilState(timePickerActiveField)
  }

  $: {
    if (browser && timePickerActiveField && REQUIED_FIELDS) {
      setTime(timePickerState, timePickerActiveField, REQUIED_FIELDS)
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
        REQUIED_FIELDS && REQUIED_FIELDS.length - 1 > elementIndex
          ? REQUIED_FIELDS[elementIndex + 1].inputField
          : undefined,
      prev:
        REQUIED_FIELDS && elementIndex > 0
          ? REQUIED_FIELDS[elementIndex - 1].inputField
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
  {#if timePrecision != null && REQUIED_FIELDS != undefined}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="timepicker" on:keydown={timePickerKeydown}>
      {#each REQUIED_FIELDS as field, i}
        {#if i != 0}
          <span class="timepicker-divider-text">:</span>
        {/if}
        <input
          bind:this={field.inputField}
          on:focus={() => (timePickerActiveField = field.inputField)}
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
