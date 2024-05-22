import { describe, it, expect, test } from 'vitest'
import { nb } from 'date-fns/locale'
import { getCalendarDays, getMonthDays, toText } from './date-utils.js'
import { createFormat, parse } from './parse.js'
import { getInnerLocale, localeFromDateFnsLocale } from './locale.js'

describe('getMonthDays', () => {
	it('gets the correct amount of days', () => {
		const feb2021 = getMonthDays(2021, 1)
		expect(feb2021.length).toEqual(28)
	})
	it('works with leap years', () => {
		const feb2020 = getMonthDays(2020, 1)
		expect(feb2020.length).toEqual(29)
	})
})

describe('getCalendarDays', () => {
	it('works for all months in 1995-2025', () => {
		const weekdayStartsOn = 1 // monday
		for (let year = 1995; year < 2025; year++) {
			for (let month = 0; month < 11; month++) {
				testMonth(year, month)
			}
		}
		function testMonth(year: number, month: number) {
			const calDays = getCalendarDays(new Date(year, month, 1), weekdayStartsOn)
			expect(calDays.length).toEqual(42)
			for (let i = 0; i < calDays.length; i++) {
				const calDay = calDays[i]
				expect({
					year: calDay.year,
					month: calDay.month,
					number: calDay.number,
					weekday: new Date(calDay.year, calDay.month, calDay.number).getDay(),
				}).toEqual({
					year: calDay.year,
					month: calDay.month,
					number: calDay.number,
					weekday: ((i % 7) + weekdayStartsOn) % 7,
				})
			}
		}
	})

	it('gets the correct correct days from the prev/next month', () => {
		const jan2020 = new Date(2020, 0, 1, 0, 0, 0, 0)
		const jan2020CalDays = getCalendarDays(jan2020, 1)
		expect(jan2020CalDays).toEqual([
			{ year: 2019, month: 11, number: 30 },
			{ year: 2019, month: 11, number: 31 },
			...getMonthDays(2020, 0),
			{ year: 2020, month: 1, number: 1 },
			{ year: 2020, month: 1, number: 2 },
			{ year: 2020, month: 1, number: 3 },
			{ year: 2020, month: 1, number: 4 },
			{ year: 2020, month: 1, number: 5 },
			{ year: 2020, month: 1, number: 6 },
			{ year: 2020, month: 1, number: 7 },
			{ year: 2020, month: 1, number: 8 },
			{ year: 2020, month: 1, number: 9 },
		])

		const dec2019 = new Date(2019, 11, 1, 0, 0, 0, 0)
		const dec2019CalDays = getCalendarDays(dec2019, 1)
		expect(dec2019CalDays).toEqual([
			{ year: 2019, month: 10, number: 25 },
			{ year: 2019, month: 10, number: 26 },
			{ year: 2019, month: 10, number: 27 },
			{ year: 2019, month: 10, number: 28 },
			{ year: 2019, month: 10, number: 29 },
			{ year: 2019, month: 10, number: 30 },
			...getMonthDays(2019, 11),
			{ year: 2020, month: 0, number: 1 },
			{ year: 2020, month: 0, number: 2 },
			{ year: 2020, month: 0, number: 3 },
			{ year: 2020, month: 0, number: 4 },
			{ year: 2020, month: 0, number: 5 },
		])
	})
})

describe('toText', () => {
	test('basic conversion', () => {
		const format = createFormat('yyyy-MM-dd HH:mm:ss')
		const text = toText(new Date(2020, 0, 1, 0, 0, 0, 0), format)
		expect(text).toEqual('2020-01-01 00:00:00')
	})

	test('conversion to month string', () => {
		const format = createFormat('dd MMM yyyy HH:mm:ss')
		const text = toText(new Date(2020, 0, 1, 0, 0, 0, 0), format)
		expect(text).toEqual('01 Jan 2020 00:00:00')
	})

	test('conversion to month string using non-en locale', () => {
		const format = createFormat('dd MMM yyyy HH:mm:ss', localeFromDateFnsLocale(nb))
		const text = toText(new Date(2020, 0, 1, 0, 0, 0, 0), format)
		expect(text).toEqual('01 jan. 2020 00:00:00')
	})
})

describe('parse()', () => {
	const baseDate = new Date(1234, 0, 1, 0, 0, 0, 999)
	const format = createFormat('yyyy--MM-dd HH:mm:ss')

	it('works with a basic date', () => {
		const result = parse('1234--12-31 23:59:59', format, baseDate)
		expect(result).toEqual({
			date: new Date(1234, 11, 31, 23, 59, 59, 999),
			missingPunctuation: '',
		})
	})

	it('works with a short month date', () => {
		const format = createFormat('dd MMM yyyy HH:mm:ss')
		const result = parse('31 Dec 2022 23:59:59', format, baseDate)
		expect(result).toEqual({
			date: new Date(2022, 11, 31, 23, 59, 59, 999),
			missingPunctuation: '',
		})
	})

	it('works with a short month date in non-En locale', () => {
		const format = createFormat('dd MMM yyyy HH:mm:ss', localeFromDateFnsLocale(nb))
		const result = parse('31 des. 2022 23:59:59', format, baseDate)
		expect(result).toEqual({
			date: new Date(2022, 11, 31, 23, 59, 59, 999),
			missingPunctuation: '',
		})
	})

	it('handles badly formed month name', () => {
		const format = createFormat('dd MMM yyyy HH:mm:ss')
		const result = parse('31 Dex 2022 23:59:59', format, baseDate)
		expect(result).toEqual({
			date: null,
			missingPunctuation: '',
		})
	})

	it('handles missing punctuation', () => {
		const result = parse('2345', format, baseDate)
		expect(result).toEqual({
			date: null,
			missingPunctuation: '--',
		})
	})

	it('fails with too high minute', () => {
		const result = parse('1234--12-31 23:99:59', format, baseDate)
		expect(result).toEqual({
			date: null,
			missingPunctuation: '',
		})
	})

	it('fails with too high date-of-month', () => {
		// separate test because some months have less than 31 days
		const dayOfMonthOverflow = parse('1234--02-31 23:59:59', format, baseDate)
		expect(dayOfMonthOverflow).toEqual({
			date: null,
			missingPunctuation: '',
		})
	})

	it('fails when the second has a non-numeric character', () => {
		const noNumber = parse('1234--02-31 23:59:5d', format, baseDate)
		expect(noNumber).toEqual({
			date: null,
			missingPunctuation: '',
		})
	})
})

describe('locale', () => {
	const nbLocale = {
		weekdays: ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø'],
		months: [
			'januar',
			'februar',
			'mars',
			'april',
			'mai',
			'juni',
			'juli',
			'august',
			'september',
			'oktober',
			'november',
			'desember',
		],
		shortMonths: [
			'jan.',
			'feb.',
			'mars',
			'apr.',
			'mai',
			'juni',
			'juli',
			'aug.',
			'sep.',
			'okt.',
			'nov.',
			'des.',
		],
		weekStartsOn: 1,
	}

	test('getInnerLocale', () => {
		const locale = getInnerLocale({
			months: nbLocale.months,
			shortMonths: nbLocale.shortMonths,
			weekStartsOn: 4,
		})

		expect(locale).toEqual({
			weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
			months: nbLocale.months,
			shortMonths: nbLocale.shortMonths,
			weekStartsOn: 4,
		})
	})

	test('localeFromDateFnsLocale', () => {
		const locale = localeFromDateFnsLocale(nb)
		expect(locale).toEqual(nbLocale)
	})
})
