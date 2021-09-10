import type { FormatToken } from './parse'

export function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}
export function getMonthLength(year: number, month: number) {
  let feb = isLeapYear(year) ? 29 : 28
  const monthLenghts = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return monthLenghts[month]
}

export function toText(date: Date, formatTokens: FormatToken[]) {
  let text = ''
  for (const token of formatTokens) {
    if (typeof token === 'string') {
      text += token
    } else {
      text += token.toString(date)
    }
  }
  return text
}

type Week = CalendarDay[]
export type CalendarDay = {
  year: number
  month: number
  number: number
}
function getMonthDays(year: number, month: number) {
  const monthLength = getMonthLength(year, month)
  let days: CalendarDay[] = []
  for (let i = 0; i < monthLength; i++) {
    days.push({
      year: year,
      month: month,
      number: i + 1,
    })
  }
  return days
}
export function getWeeks(value: Date) {
  const year = value.getFullYear()
  const month = value.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()

  let days: CalendarDay[] = []

  // add last month
  const daysBefore = firstWeekday
  if (daysBefore > 0) {
    let lastMonth = month - 1
    let lastMonthYear = year
    if (lastMonth === -1) {
      lastMonth = 11
      lastMonthYear = year - 1
    }
    days = getMonthDays(lastMonthYear, lastMonth).slice(-daysBefore)
  }

  // add current month
  days = days.concat(getMonthDays(year, month))

  // add next month
  let daysAfter = 7 - (days.length % 7 || 7)
  let nextMonth = month + 1
  let nextMonthYear = year
  if (nextMonth === 12) {
    nextMonth = 0
    nextMonthYear = year + 1
  }
  days = days.concat(getMonthDays(nextMonthYear, nextMonth).slice(0, daysAfter))

  const weeks: Week[] = []
  for (let i = 0; i < days.length; i++) {
    if (i % 7 === 0) {
      weeks.push(days.slice(i, i + 7))
    }
  }
  return weeks
}
