<script lang="ts">
  import { getMonthLength, getCalendarDays } from './date-utils'
  import type { CalendarDay } from './date-utils'
  import { getInnerLocale } from './locale'
  import type { Locale } from './locale'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher<{ select: undefined }>()

  /** Date value. It's `null` if no date is selected */
  export let value: Date | null = null
  function setValue(d: Date) {
    if (d.getTime() !== value?.getTime()) {
      value = d
    }
  }
  function updateValue(updater: (date: Date) => Date) {
    const newValue = updater(new Date(shownDate.getTime()))
    setValue(newValue)
  }

  /** Default Date to use */
  const defaultDate = new Date()

  /** The date shown in the popup, for when `value` is null */
  let shownDate = value ?? defaultDate
  $: if (value) shownDate = value

  /** Update the shownDate. The date is only selected if a date is already selected */
  function updateShownDate(updater: (date: Date) => Date) {
    shownDate = updater(new Date(shownDate.getTime()))
    if (value && shownDate.getTime() !== value.getTime()) {
      setValue(shownDate)
    }
  }

  /** The earliest year the user can select */
  export let min = new Date(defaultDate.getFullYear() - 20, 0, 1)
  /** The latest year the user can select */
  export let max = new Date(defaultDate.getFullYear(), 11, 31, 23, 59, 59, 999)
  let years = getYears(min, max)
  $: years = getYears(min, max)
  function getYears(min: Date, max: Date) {
    let years = []
    for (let i = min.getFullYear(); i <= max.getFullYear(); i++) {
      years.push(i)
    }
    return years
  }

  $: if (shownDate > max) {
    updateShownDate(() => max)
  } else if (shownDate < min) {
    updateShownDate(() => min)
  }

  /** Locale object for internationalization */
  export let locale: Locale = {}
  $: iLocale = getInnerLocale(locale)

  let year = shownDate.getFullYear()
  const getYear = (tmpPickerDate: Date) => (year = tmpPickerDate.getFullYear())
  function setYear(year: number) {
    updateShownDate((tmpPickerDate) => {
      tmpPickerDate.setFullYear(year)
      return tmpPickerDate
    })
  }
  $: getYear(shownDate)
  $: setYear(year)

  let month = shownDate.getMonth()
  const getMonth = (tmpPickerDate: Date) => (month = tmpPickerDate.getMonth())
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
    const newDate = Math.min(shownDate.getDate(), maxDate)
    updateShownDate((date) => {
      return new Date(
        newYear,
        newMonth,
        newDate,
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      )
    })
  }
  $: getMonth(shownDate)
  $: setMonth(month)

  let dayOfMonth = value?.getDate() || null
  $: dayOfMonth = value?.getDate() || null

  $: calendarDays = getCalendarDays(shownDate, iLocale.weekStartsOn)

  function setDay(calendarDay: CalendarDay) {
    if (dayIsInRange(calendarDay, min, max)) {
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
  function selectDay(calendarDay: CalendarDay) {
    setDay(calendarDay)
    dispatch('select')
  }
  function dayIsInRange(calendarDay: CalendarDay, min: Date, max: Date) {
    const date = new Date(calendarDay.year, calendarDay.month, calendarDay.number)
    const minDate = new Date(min.getFullYear(), min.getMonth(), min.getDate())
    const maxDate = new Date(max.getFullYear(), max.getMonth(), max.getDate())
    return date >= minDate && date <= maxDate
  }
  function yearKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') {
      setYear(year - 1)
      e.preventDefault()
    } else if (e.key === 'ArrowDown') {
      setYear(year + 1)
      e.preventDefault()
    } else if (e.key === 'ArrowLeft') {
      setMonth(month - 1)
      e.preventDefault()
    } else if (e.key === 'ArrowRight') {
      setMonth(month + 1)
      e.preventDefault()
    }
  }
  function monthKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      setMonth(month - 1)
      e.preventDefault()
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      setMonth(month + 1)
      e.preventDefault()
    }
  }

  function shiftKeydown(e: KeyboardEvent) {
    if (e.shiftKey && e.key === 'ArrowUp') {
      setYear(year - 1)
    } else if (e.shiftKey && e.key === 'ArrowDown') {
      setYear(year + 1)
    } else if (e.shiftKey && e.key === 'ArrowLeft') {
      setMonth(month - 1)
    } else if (e.shiftKey && e.key === 'ArrowRight') {
      setMonth(month + 1)
    } else {
      return false
    }
    e.preventDefault()
    return true
  }

  function calendarDayKeydown(e: KeyboardEvent) {
    let shift = e.shiftKey || e.altKey
    if (shift) {
      shiftKeydown(e)
      return
    } else if (e.key === ' ') {
      dispatch('select')
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      updateValue((value) => {
        value.setDate(value.getDate() - 7)
        return value
      })
      e.preventDefault()
    } else if (e.key === 'ArrowDown') {
      updateValue((value) => {
        value.setDate(value.getDate() + 7)
        return value
      })
      e.preventDefault()
    } else if (e.key === 'ArrowLeft') {
      updateValue((value) => {
        value.setDate(value.getDate() - 1)
        return value
      })
      e.preventDefault()
    } else if (e.key === 'ArrowRight') {
      updateValue((value) => {
        value.setDate(value.getDate() + 1)
        return value
      })
      e.preventDefault()
    } else {
      return
    }
  }
</script>

<div class="date-time-picker" on:focusout>
  <div class="tab-container" tabindex="-1">
    <div class="top">
      <div class="page-button" tabindex="-1" on:click={() => setMonth(month - 1)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          ><path
            d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"
            transform="rotate(180, 12, 12)"
          /></svg
        >
      </div>
      <div class="dropdown month">
        <select bind:value={month} on:keydown={monthKeydown}>
          {#each iLocale.months as monthName, i}
            <option
              disabled={new Date(year, i, getMonthLength(year, i), 23, 59, 59, 999) < min ||
                new Date(year, i) > max}
              value={i}>{monthName}</option
            >
          {/each}
        </select>
        <!--
          Here we have use `select.dummy-select` for showing just the <select> button. This
          is to style the <select> button without affecting the menu popup
          - `option { color: initial }` causes invisible menu in dark mode on Firefox
          - `option { color: initial; background-color: initial }` causes invisible menu in Chrome
          - `select { background-color: $bg; color: $text }` causes white scrollbar in dark mode on Firefox
        -->
        <select class="dummy-select" tabindex="-1">
          {#each iLocale.months as monthName, i}
            <option value={i} selected={i === month}>{monthName}</option>
          {/each}
        </select>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          ><path d="M6 0l12 12-12 12z" transform="rotate(90, 12, 12)" /></svg
        >
      </div>
      <div class="dropdown year">
        <select bind:value={year} on:keydown={yearKeydown}>
          {#each years as v}
            <option value={v}>{v}</option>
          {/each}
        </select>
        <!-- style <select> button without affecting menu popup -->
        <select class="dummy-select" tabindex="-1">
          {#each years as v}
            <option value={v} selected={v === year}>{v}</option>
          {/each}
        </select>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          ><path d="M6 0l12 12-12 12z" transform="rotate(90, 12, 12)" /></svg
        >
      </div>
      <div class="page-button" tabindex="-1" on:click={() => setMonth(month + 1)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          ><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" /></svg
        >
      </div>
    </div>
    <div class="calendar-day" tabindex="0" on:keydown={calendarDayKeydown}>
      <div class="header">
        {#each Array(7) as _, i}
          {#if i + iLocale.weekStartsOn < 7}
            <div class="header-cell">{iLocale.weekdays[iLocale.weekStartsOn + i]}</div>
          {:else}
            <div class="header-cell">{iLocale.weekdays[iLocale.weekStartsOn + i - 7]}</div>
          {/if}
        {/each}
      </div>
      {#each Array(6) as _, weekIndex}
        <div class="week">
          {#each calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7) as calendarDay}
            <div
              class="cell"
              on:keydown|self={calendarDayKeydown}
              on:click={() => selectDay(calendarDay)}
              class:disabled={!dayIsInRange(calendarDay, min, max)}
              class:selected={calendarDay.month === month && calendarDay.number === dayOfMonth}
              class:other-month={calendarDay.month !== month}
            >
              <span>{calendarDay.number}</span>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="sass">
  .date-time-picker
    display: inline-block
    color: var(--date-picker-foreground, #000000)
    background: var(--date-picker-background, #ffffff)
    user-select: none
    -webkit-user-select: none
    padding: 0.5rem
    cursor: default
    font-size: 0.75rem
    border: 1px solid rgba(103, 113, 137, 0.3)
    border-radius: 3px
    box-shadow: 0px 2px 6px rgba(#000000,0.08), 0px 2px 6px rgba(#000000,0.11)
    outline: none
    transition: all 80ms cubic-bezier(0.4, 0.0, 0.2, 1)
    &:focus
      border-color: var(--date-picker-highlight-border, #0269f7)
      box-shadow: 0px 0px 0px 2px var(--date-picker-highlight-shadow, rgba(#0269f7, 0.4))
  .tab-container
    outline: none
  .top
    display: flex
    justify-content: center
    align-items: center
    padding-bottom: 0.5rem
  .dropdown
    margin-left: 0.25rem
    margin-right: 0.25rem
    position: relative
    display: flex
    svg
      position: absolute
      right: 0px
      top: 0px
      height: 100%
      width: 8px
      padding: 0rem 0.5rem
      pointer-events: none
  .month
    flex-grow: 1
  .year
    flex-grow: 1
  svg
    display: block
    fill: var(--date-picker-foreground, #000000)
    opacity: 0.75
    outline: none
  .page-button
    width: 1.5rem
    height: 1.5rem
    flex-shrink: 0
    border-radius: 5px
    box-sizing: border-box
    border: 1px solid transparent
    display: flex
    align-items: center
    justify-content: center
    &:hover
      background-color: rgba(#808080, 0.08)
      border: 1px solid rgba(#808080, 0.08)
    svg
      width: 0.68rem
      height: 0.68rem
  select.dummy-select
    position: absolute
    width: 100%
    pointer-events: none
    outline: none
    color: var(--date-picker-foreground, #000000)
    background-color: var(--date-picker-background, #ffffff)
    border-radius: 3px
  select:focus + select.dummy-select
    border-color: var(--date-picker-highlight-border, #0269f7)
    box-shadow: 0px 0px 0px 2px var(--date-picker-highlight-shadow, rgba(#0269f7, 0.4))
  select:not(.dummy-select)
    border-radius: 100px
  select
    font-size: inherit
    font-family: inherit
    -webkit-appearance: none
    -moz-appearance: none
    appearance: none
    flex-grow: 1
    padding: 0rem 0.35rem
    height: 1.5rem
    padding-right: 1.3rem
    margin: 0px
    border: 1px solid rgba(108, 120, 147, 0.3)
    outline: none
    transition: all 80ms cubic-bezier(0.4, 0.0, 0.2, 1)

  .header
    display: flex
    font-weight: 600
    padding-bottom: 2px
  .header-cell
    width: 1.875rem
    text-align: center
    flex-grow: 1

  .week
    display: flex
  .cell
    display: flex
    align-items: center
    justify-content: center
    width: 2rem
    height: 1.94rem
    flex-grow: 1
    border-radius: 5px
    box-sizing: border-box
    border: 2px solid transparent
    &:hover
      border: 1px solid rgba(#808080, 0.08)
      background-color: rgba(#808080, 0.08)
    &.disabled
      visibility: hidden
    &.disabled:hover
      border: none
      background-color: transparent
    &.other-month span
      opacity: 0.4
    &.selected
      color: var(--date-picker-selected-color, inherit)
      background: var(--date-picker-selected-background, rgba(2, 105, 247, 0.2))
      border: 2px solid var(--date-picker-highlight-border, #0269f7)

  .calendar-day
    padding: 0.75rem 0.25rem 0.25rem
    outline: none
    border: 1px solid rgba(#808080, 0.1)
    border-radius: 3px
  .calendar-day:focus
    transition: all 80ms cubic-bezier(0.4, 0.0, 0.2, 1)
    border-color: var(--date-picker-highlight-border, #0269f7)
    box-shadow: 0px 0px 0px 2px var(--date-picker-highlight-shadow, rgba(#0269f7, 0.4))

</style>
