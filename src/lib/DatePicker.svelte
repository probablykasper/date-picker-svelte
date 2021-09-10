<script lang="ts">
  import { getMonthLength, getWeeks } from './date-utils'
  import type { CalendarDay } from './date-utils'

  export let value = new Date()
  export let visible = true
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
  const years = [2018, 2019, 2020, 2021]

  let year = value.getFullYear()
  const getYear = (value: Date) => (year = value.getFullYear())
  function setYear(year: number) {
    value.setFullYear(year)
    value = value
  }
  $: getYear(value)
  $: setYear(year)

  let month = value.getMonth()
  const getMonth = (value: Date) => (month = value.getMonth())
  function setMonth(month: number) {
    const maxDate = getMonthLength(year, month)
    const newDate = Math.min(value.getDate(), maxDate)
    value = new Date(
      year,
      month,
      newDate,
      value.getHours(),
      value.getMinutes(),
      value.getSeconds(),
      value.getMilliseconds()
    )
  }
  $: getMonth(value)
  $: setMonth(month)

  let dayOfMonth = value.getDate()
  $: dayOfMonth = value.getDate()

  export let parentElement: HTMLElement | null = null
  export const onFocusOut = (e: FocusEvent) => {
    let relatedTarget = parentElement || e.relatedTarget
    if (
      e?.currentTarget instanceof HTMLElement &&
      relatedTarget &&
      relatedTarget instanceof HTMLElement &&
      e.currentTarget.contains(relatedTarget)
    ) {
      return
    } else {
      visible = false
    }
  }

  $: weeks = getWeeks(value)

  function setDay(day: CalendarDay) {
    value.setFullYear(0)
    value.setMonth(0)
    value.setDate(1)
    value.setFullYear(day.year)
    value.setMonth(day.month)
    value.setDate(day.number)
    value = value
  }
</script>

<div class="date-time-picker" on:focusout={onFocusOut} tabindex="-1">
  <select bind:value={month}>
    {#each monthNames as monthName, i}
      <option value={i}>{monthName}</option>
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
      &.other-month
        color: #9FA9B2
      &.selected
        background-color: #0074f0
        color: #ffffff
  select
    font-size: inherit
</style>
