import type { FormatToken } from './parse.js'

export function isLeapYear(year: number): boolean {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}
export function getMonthLength(year: number, month: number): number {
	const feb = isLeapYear(year) ? 29 : 28
	const monthLengths = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	return monthLengths[month]
}

export function toText(date: Date | null, formatTokens: FormatToken[]): string {
	let text = ''
	if (date) {
		for (const token of formatTokens) {
			if (typeof token === 'string') {
				text += token
			} else {
				text += token.toString(date)
			}
		}
	}
	return text
}

export function isSameDate(date1: Date, date2: Date) {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	)
}

export type CalendarDay = {
	year: number
	month: number
	number: number
}
export function getMonthDays(year: number, month: number): CalendarDay[] {
	const monthLength = getMonthLength(year, month)
	const days: CalendarDay[] = []
	for (let i = 0; i < monthLength; i++) {
		days.push({
			year: year,
			month: month,
			number: i + 1,
		})
	}
	return days
}
export function getCalendarDays(value: Date, weekStartsOn: number): CalendarDay[] {
	const year = value.getFullYear()
	const month = value.getMonth()
	const firstWeekday = new Date(year, month, 1).getDay()

	let days: CalendarDay[] = []

	// add last month
	const daysBefore = (firstWeekday - weekStartsOn + 7) % 7
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
	let nextMonth = month + 1
	let nextMonthYear = year
	if (nextMonth === 12) {
		nextMonth = 0
		nextMonthYear = year + 1
	}
	const daysAfter = 42 - days.length
	days = days.concat(getMonthDays(nextMonthYear, nextMonth).slice(0, daysAfter))

	return days
}

export function applyTimePrecision(
	date: Date,
	timePrecision: 'minute' | 'second' | 'millisecond' | null,
) {
	// Set unused time components to 0
	if (timePrecision === null) {
		date.setHours(0, 0, 0, 0)
	} else if (timePrecision === 'minute') {
		date.setSeconds(0, 0)
	} else if (timePrecision === 'second') {
		date.setMilliseconds(0)
	}
}

export function cloneDate(d: Date) {
	return new Date(d)
}

export function toValidDate(
	oldDate: Date,
	newDate: Date,
	minDate: Date,
	maxDate: Date,
	isDisabledDate: ((date: Date) => boolean) | null,
): Date {
	// Don't mutate the original newDate to avoid unintended side effects
	let adjustedDate = cloneDate(newDate)

	if (oldDate > newDate) {
		adjustDate(adjustedDate, -1, minDate, maxDate, isDisabledDate)
		if (adjustedDate < minDate) {
			adjustedDate = clampDate(adjustedDate, minDate, maxDate)
			// Adjusts the date one more time if the min date is disabled, to ensure a valid, enabled date is selected
			adjustDate(adjustedDate, 1, minDate, maxDate, isDisabledDate)
		}
	} else if (adjustedDate >= oldDate) {
		adjustDate(adjustedDate, 1, minDate, maxDate, isDisabledDate)
		if (adjustedDate > maxDate) {
			adjustedDate = clampDate(adjustedDate, minDate, maxDate)
			// Adjusts the date one more time if the max date is disabled, to ensure a valid, enabled date is selected
			adjustDate(adjustedDate, -1, minDate, maxDate, isDisabledDate)
		}
	}
	// Finally, clamp the time
	if (adjustedDate < minDate || adjustedDate > maxDate) {
		adjustedDate = clamp(adjustedDate, minDate, maxDate)
	}
	return adjustedDate
}

function adjustDate(
	date: Date,
	increment: number,
	minDate: Date,
	maxDate: Date,
	isDisabledDate: ((date: Date) => boolean) | null,
) {
	// Prevents accidental infinite loops
	const MAXLOOPS = 36525 // ~100 years, should be large enough
	let loopCount = 0

	while (isDisabledDate?.(date) && date >= minDate && date <= maxDate && loopCount <= MAXLOOPS) {
		date.setDate(date.getDate() + increment)
		loopCount++
	}
}

export function clamp(value: Date, min: Date, max: Date) {
	if (value > max) {
		return cloneDate(max)
	} else if (value < min) {
		return cloneDate(min)
	} else {
		return cloneDate(value)
	}
}
export function clampDate(value: Date, min: Date, max: Date) {
	const limit = clamp(value, min, max)
	value = new Date(
		limit.getFullYear(),
		limit.getMonth(),
		limit.getDate(),
		value.getHours(),
		value.getMinutes(),
		value.getSeconds(),
		value.getMilliseconds(),
	)
	if (value > max) {
		value.setDate(max.getDate())
	}
	if (value < min) {
		value.setDate(min.getDate())
	}
	return value
}
