<script lang="ts">
  import { getMonthLength, getCalendarDays } from './date-utils'
  import type { CalendarDay } from './date-utils'
  import { getInnerLocale } from './locale'
  import type { Locale } from './locale'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher<{ select: undefined }>()

  function cloneDate(d: Date) {
    return new Date(d.getTime())
  }

  /** Date value. It's `null` if no date is selected */
  export let value: Date | null = null

  function setValue(d: Date) {
    if (d.getTime() !== value?.getTime()) {
      browseDate = clamp(d, min, max)
      value = cloneDate(browseDate)
    }
  }
  function browse(d: Date) {
    browseDate = clamp(d, min, max)
    if (!browseWithoutSelecting && value) {
      setValue(browseDate)
    }
  }

  /** Default Date to use */
  const defaultDate = new Date()

  /** The date shown in the popup when none is selected */
  let browseDate = value ? cloneDate(value) : cloneDate(defaultDate)

  /** The earliest year the user can select */
  export let min = new Date(defaultDate.getFullYear() - 20, 0, 1)
  /** The latest year the user can select */
  export let max = new Date(defaultDate.getFullYear(), 11, 31, 23, 59, 59, 999)
  $: if (value && value > max) {
    setValue(max)
  } else if (value && value < min) {
    setValue(min)
  }
  function clamp(d: Date, min: Date, max: Date) {
    if (d > max) {
      return cloneDate(max)
    } else if (d < min) {
      return cloneDate(min)
    } else {
      return cloneDate(d)
    }
  }

  let years = getYears(min, max)
  $: years = getYears(min, max)
  function getYears(min: Date, max: Date) {
    let years = []
    for (let i = min.getFullYear(); i <= max.getFullYear(); i++) {
      years.push(i)
    }
    return years
  }

  /** Locale object for internationalization */
  export let locale: Locale = {}
  $: iLocale = getInnerLocale(locale)
  /** Wait with updating the date until a date is selected */
  export let browseWithoutSelecting = false

  $: browseYear = browseDate.getFullYear()
  function setYear(newYear: number) {
    browseDate.setFullYear(newYear)
    browseDate = browseDate
    browse(browseDate)
  }

  $: browseMonth = browseDate.getMonth()
  function setMonth(newMonth: number) {
    let newYear = browseDate.getFullYear()
    if (newMonth === 12) {
      newMonth = 0
      newYear++
    } else if (newMonth === -1) {
      newMonth = 11
      newYear--
    }

    const maxDate = getMonthLength(newYear, newMonth)
    const newDate = Math.min(browseDate.getDate(), maxDate)
    browse(
      new Date(
        newYear,
        newMonth,
        newDate,
        browseDate.getHours(),
        browseDate.getMinutes(),
        browseDate.getSeconds(),
        browseDate.getMilliseconds()
      )
    )
  }

  $: calendarDays = getCalendarDays(browseDate, iLocale.weekStartsOn)

  function selectDay(calendarDay: CalendarDay) {
    if (dayIsInRange(calendarDay, min, max)) {
      browseDate.setFullYear(0)
      browseDate.setMonth(0)
      browseDate.setDate(1)
      browseDate.setFullYear(calendarDay.year)
      browseDate.setMonth(calendarDay.month)
      browseDate.setDate(calendarDay.number)
      setValue(browseDate)
      dispatch('select')
    }
  }
  function dayIsInRange(calendarDay: CalendarDay, min: Date, max: Date) {
    const date = new Date(calendarDay.year, calendarDay.month, calendarDay.number)
    const minDate = new Date(min.getFullYear(), min.getMonth(), min.getDate())
    const maxDate = new Date(max.getFullYear(), max.getMonth(), max.getDate())
    return date >= minDate && date <= maxDate
  }
  function shiftKeydown(e: KeyboardEvent) {
    if (e.shiftKey && e.key === 'ArrowUp') {
      setYear(browseDate.getFullYear() - 1)
    } else if (e.shiftKey && e.key === 'ArrowDown') {
      setYear(browseDate.getFullYear() + 1)
    } else if (e.shiftKey && e.key === 'ArrowLeft') {
      setMonth(browseDate.getMonth() - 1)
    } else if (e.shiftKey && e.key === 'ArrowRight') {
      setMonth(browseDate.getMonth() + 1)
    } else {
      return false
    }
    e.preventDefault()
    return true
  }
  function yearKeydown(e: KeyboardEvent) {
    let shift = e.shiftKey || e.altKey
    if (shift) {
      shiftKeydown(e)
      return
    } else if (e.key === 'ArrowUp') {
      setYear(browseDate.getFullYear() - 1)
    } else if (e.key === 'ArrowDown') {
      setYear(browseDate.getFullYear() + 1)
    } else if (e.key === 'ArrowLeft') {
      setMonth(browseDate.getMonth() - 1)
    } else if (e.key === 'ArrowRight') {
      setMonth(browseDate.getMonth() + 1)
    } else {
      shiftKeydown(e)
      return
    }
    e.preventDefault()
  }
  function monthKeydown(e: KeyboardEvent) {
    let shift = e.shiftKey || e.altKey
    if (shift) {
      shiftKeydown(e)
      return
    } else if (e.key === 'ArrowUp') {
      setMonth(browseDate.getMonth() - 1)
    } else if (e.key === 'ArrowDown') {
      setMonth(browseDate.getMonth() + 1)
    } else if (e.key === 'ArrowLeft') {
      setMonth(browseDate.getFullYear() - 1)
    } else if (e.key === 'ArrowRight') {
      setMonth(browseDate.getFullYear() + 1)
    } else {
      shiftKeydown(e)
      return
    }
    e.preventDefault()
  }
  function keydown(e: KeyboardEvent) {
    let shift = e.shiftKey || e.altKey
    if ((e.target as HTMLElement)?.tagName === 'SELECT') {
      return
    }
    if (shift) {
      shiftKeydown(e)
      return
    } else if (e.key === 'ArrowUp') {
      browseDate.setDate(browseDate.getDate() - 7)
      setValue(browseDate)
    } else if (e.key === 'ArrowDown') {
      browseDate.setDate(browseDate.getDate() + 7)
      setValue(browseDate)
    } else if (e.key === 'ArrowLeft') {
      browseDate.setDate(browseDate.getDate() - 1)
      setValue(browseDate)
    } else if (e.key === 'ArrowRight') {
      browseDate.setDate(browseDate.getDate() + 1)
      setValue(browseDate)
    } else if (e.key === 'Enter') {
      setValue(browseDate)
      dispatch('select')
    } else {
      return
    }
    e.preventDefault()
  }
</script>

<div class="date-time-picker" on:focusout tabindex="0" on:keydown={keydown}>
  <div class="tab-container" tabindex="-1">
    <div class="top">
      <div class="page-button" tabindex="-1" on:click={() => setMonth(browseDate.getMonth() - 1)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          ><path
            d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"
            transform="rotate(180, 12, 12)"
          /></svg
        >
      </div>
      <div class="dropdown month">
        <select
          value={browseMonth}
          on:keydown={monthKeydown}
          on:input={(e) => setMonth(parseInt(e.currentTarget.value))}
        >
          {#each iLocale.months as monthName, i}
            <option
              disabled={new Date(browseYear, i, getMonthLength(browseYear, i), 23, 59, 59, 999) <
                min || new Date(browseYear, i) > max}
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
            <option value={i} selected={i === browseMonth}>{monthName}</option>
          {/each}
        </select>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          ><path d="M6 0l12 12-12 12z" transform="rotate(90, 12, 12)" /></svg
        >
      </div>
      <div class="dropdown year">
        <select
          value={browseYear}
          on:input={(e) => setYear(parseInt(e.currentTarget.value))}
          on:keydown={yearKeydown}
        >
          {#each years as v}
            <option value={v}>{v}</option>
          {/each}
        </select>
        <!-- style <select> button without affecting menu popup -->
        <select class="dummy-select" tabindex="-1">
          {#each years as v}
            <option value={v} selected={v === browseDate.getFullYear()}>{v}</option>
          {/each}
        </select>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          ><path d="M6 0l12 12-12 12z" transform="rotate(90, 12, 12)" /></svg
        >
      </div>
      <div class="page-button" tabindex="-1" on:click={() => setMonth(browseDate.getMonth() + 1)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          ><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" /></svg
        >
      </div>
    </div>
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
            on:click={() => selectDay(calendarDay)}
            class:disabled={!dayIsInRange(calendarDay, min, max)}
            class:selected={calendarDay.year === value?.getFullYear() &&
              calendarDay.month === value?.getMonth() &&
              calendarDay.number === value.getDate()}
            class:other-month={calendarDay.month !== browseMonth}
          >
            <span>{calendarDay.number}</span>
          </div>
        {/each}
      </div>
    {/each}
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
</style>
