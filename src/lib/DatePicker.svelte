<script lang="ts">
  import { getMonthLength, getCalendarDays } from './date-utils'
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
    setValue(max)
  } else if (value < min) {
    setValue(min)
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
    let newYear = year
    let newMonth = month
    if (month === 12) {
      newMonth = 0
      newYear++
    } else if (month === -1) {
      newMonth = 11
      newYear--
    }

    const maxDate = getMonthLength(newYear, newMonth)
    const newDate = Math.min(value.getDate(), maxDate)
    setValue(
      new Date(
        newYear,
        newMonth,
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

  $: calendarDays = getCalendarDays(value)

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
  function yearKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') {
      setYear(year - 1)
    } else if (e.key === 'ArrowDown') {
      setYear(year + 1)
    } else if (e.key === 'ArrowLeft') {
      setMonth(month - 1)
    } else if (e.key === 'ArrowRight') {
      setMonth(month + 1)
    } else {
      return
    }
    e.preventDefault()
  }
  function monthKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') {
      setMonth(month - 1)
    } else if (e.key === 'ArrowDown') {
      setMonth(month + 1)
    } else if (e.key === 'ArrowLeft') {
      setMonth(month - 1)
    } else if (e.key === 'ArrowRight') {
      setMonth(month + 1)
    } else {
      return
    }
    e.preventDefault()
  }
  function keydown(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') {
      updateValue((value) => {
        value.setDate(value.getDate() - 7)
        return value
      })
    } else if (e.key === 'ArrowDown') {
      updateValue((value) => {
        value.setDate(value.getDate() + 7)
        return value
      })
    } else if (e.key === 'ArrowLeft') {
      updateValue((value) => {
        value.setDate(value.getDate() - 1)
        return value
      })
    } else if (e.key === 'ArrowRight') {
      updateValue((value) => {
        value.setDate(value.getDate() + 1)
        return value
      })
    } else {
      return
    }
    e.preventDefault()
  }
</script>

<div class="date-time-picker" on:focusout tabindex="-1" on:keydown|self={keydown}>
  <div class="top">
    <svg
      class="page-button previous"
      tabindex="-1"
      on:click={() => setMonth(month - 1)}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      ><path
        d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"
        transform="rotate(180, 12, 12)" /></svg>
    <div class="dropdown month">
      <select bind:value={month} on:keydown={monthKeydown}>
        {#each monthNames as monthName, i}
          <option
            disabled={new Date(year, i, getMonthLength(year, i), 23, 59, 59, 999) < min ||
              new Date(year, i) > max}
            value={i}>{monthName}</option>
        {/each}
      </select>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        ><path d="M6 0l12 12-12 12z" transform="rotate(90, 12, 12)" /></svg>
    </div>
    <div class="dropdown year">
      <select bind:value={year} on:keydown={yearKeydown}>
        {#each years as year}
          <option value={year}>{year}</option>
        {/each}
      </select>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        ><path d="M6 0l12 12-12 12z" transform="rotate(90, 12, 12)" /></svg>
    </div>
    <svg
      class="page-button"
      tabindex="-1"
      on:click={() => setMonth(month + 1)}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" /></svg>
  </div>
  <div class="header">
    {#each weekdayNames as weekdayName}
      <div class="header-cell">{weekdayName}</div>
    {/each}
  </div>
  {#each Array(6) as _, weekIndex}
    <div class="week">
      {#each calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7) as calendarDay}
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
    font-size: 12px
    border: 1px solid #c6cddd
    border-radius: 3px
    box-shadow: 0px 3px 6px rgba(#000000,0.08), 0px 3px 6px rgba(#000000,0.11)
  .top
    display: flex
    justify-content: center
    align-items: center
    padding-bottom: 8px
    .dropdown, svg.previous
      margin-right: 8px
    .dropdown
      position: relative
      display: flex
      svg
        position: absolute
        right: 0px
        top: 0px
        height: 100%
        width: 8px
        padding: 0px 8px
        pointer-events: none
    .month
      flex-grow: 1
    .year
      flex-grow: 1
    svg
      fill: #404040
      outline: none
    svg.page-button
      width: 10px
      height: 10px
      padding: 6px
      flex-shrink: 0
      border-radius: 5px
      &:hover
        background-color: rgba(#000000, 0.07)
      &:active
        background-color: rgba(#000000, 0.14)
    select
      font-size: inherit
      font-family: inherit
      -webkit-appearance: none
      -moz-appearance: none
      appearance: none
      background-color: transparent
      flex-grow: 1
      padding: 2px 5px
      height: 22px
      padding-right: 22px
      margin: 0px
      border: 1px solid #c6cddd
      border-radius: 3px
      outline: none
      transition: all 80ms ease-in-out
      &:focus
        border-color: #3061F6
        box-shadow: 0px 0px 0px 2px rgba(#3061F6, 0.5)
  .header
    display: flex
    font-weight: 600
    .header-cell
      width: 30px
      text-align: center
      flex-grow: 1
  .week
    display: flex
    .cell
      display: flex
      align-items: center
      justify-content: center
      width: 30px
      height: 30px
      flex-grow: 1
      border-radius: 4px
      &:hover
        background-color: rgba(#000000, 0.07)
      &.disabled:hover
        background-color: transparent
      &.other-month
        color: #9FA9B2
      &.selected
        background-color: #0074f0
        color: #ffffff
</style>
