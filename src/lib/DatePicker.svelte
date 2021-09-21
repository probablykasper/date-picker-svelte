<script lang="ts">
  import { getMonthLength, getWeeks } from './date-utils'
  import type { CalendarDay } from './date-utils'

  /** Date value */
  export let value = new Date()
  function setValue(d: Date) {
    if (d.getTime() !== value.getTime()) value = d
  }
  function updateValue(updater: (date: Date) => Date) {
    let d = updater(new Date(value.getTime()))
    if (d.getTime() !== value.getTime()) value = d
  }
  const weekdayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  /** The earliest year the user can select */
  export let min = new Date(new Date().getFullYear() - 20, 0, 1)
  /** The latest year the user can select */
  export let max = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999)
  let years = getYears(min, max)
  $: years = getYears(min, max)
  function getYears(min: Date, max: Date) {
    let years = []
    for (let i = min.getFullYear(); i <= max.getFullYear(); i++) {
      years.push(i)
    }
    return years
  }
  $: if (value > max) {
    console.log('MAX', max)
    setValue(max)
  } else if (value < min) {
    console.log('MIN', min)
    setValue(min)
  } else {
    console.log('x', value)
  }

  let year = value.getFullYear()
  const getYear = (value: Date) => (year = value.getFullYear())
  function setYear(year: number) {
    updateValue((value) => {
      value.setFullYear(year)
      return value
    })
  }
  $: getYear(value)
  $: setYear(year)

  let month = value.getMonth()
  const getMonth = (value: Date) => (month = value.getMonth())
  function setMonth(month: number) {
    const maxDate = getMonthLength(year, month)
    const newDate = Math.min(value.getDate(), maxDate)
    setValue(
      new Date(
        year,
        month,
        newDate,
        value.getHours(),
        value.getMinutes(),
        value.getSeconds(),
        value.getMilliseconds()
      )
    )
  }
  $: getMonth(value)
  $: setMonth(month)

  let dayOfMonth = value.getDate()
  $: dayOfMonth = value.getDate()

  $: weeks = getWeeks(value)

  function setDay(calendarDay: CalendarDay) {
    if (dayIsInRange(calendarDay)) {
      updateValue((value) => {
        value.setFullYear(0)
        value.setMonth(0)
        value.setDate(1)
        value.setFullYear(calendarDay.year)
        value.setMonth(calendarDay.month)
        value.setDate(calendarDay.number)
        return value
      })
    }
  }
  function dayIsInRange(calendarDay: CalendarDay) {
    const date = new Date(calendarDay.year, calendarDay.month, calendarDay.number)
    const minDate = new Date(min.getFullYear(), min.getMonth(), min.getDate())
    const maxDate = new Date(max.getFullYear(), max.getMonth(), max.getDate())
    return date >= minDate && date <= maxDate
  }
</script>

<div class="date-time-picker" on:focusout tabindex="-1">
  <select bind:value={month}>
    {#each monthNames as monthName, i}
      <option
        disabled={new Date(year, i, getMonthLength(year, i), 23, 59, 59, 999) < min ||
          new Date(year, i) > max}
        value={i}>{monthName}</option>
    {/each}
  </select>
  <select bind:value={year}>
    {#each years as year}
      <option value={year}>{year}</option>
    {/each}
  </select>
  <div class="header">
    {#each weekdayNames as weekdayName}
      <div class="header-cell">{weekdayName}</div>
    {/each}
  </div>
  {#each weeks as week}
    <div class="week">
      {#each week as calendarDay}
        <div
          class="cell"
          on:click={() => setDay(calendarDay)}
          class:disabled={!dayIsInRange(calendarDay)}
          class:selected={calendarDay.month === month && calendarDay.number === dayOfMonth}
          class:other-month={calendarDay.month !== month}>
          {calendarDay.number}
        </div>
      {/each}
    </div>
  {/each}
</div>

<style lang="sass">
  .date-time-picker
    display: inline-block
    outline: none
    background-color: white
    user-select: none
    -webkit-user-select: none
    padding: 8px
    cursor: default
    font-size: 0.8em
    border: 1px solid #c6cddd
    border-radius: 3px
    box-shadow: 0px 4px 4px 0px rgba(#000000, 0.1)
  .header
    display: flex
    font-weight: 600
    .header-cell
      width: 30px
      text-align: center
  .week
    display: flex
    .cell
      display: flex
      align-items: center
      justify-content: center
      width: 30px
      height: 30px
      border-radius: 4px
      &:hover
        background-color: #ededed
      &.disabled:hover
        background-color: transparent
      &.other-month
        color: #9FA9B2
      &.selected
        background-color: #0074f0
        color: #ffffff
  select
    font-size: inherit
</style>
