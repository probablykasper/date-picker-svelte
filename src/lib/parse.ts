import { getMonthLength } from '$lib/date-utils.js'
import { getInnerLocale, localeFromDateFnsLocale } from '$lib/locale'
import type { InnerLocale } from '$lib/locale'

type RuleToken = {
	id: string
	toString: (d: Date, l: InnerLocale) => string
}

export type FormatToken = string | RuleToken

export class FormatTokens implements Iterable<FormatToken> {
	constructor(
		public formatTokens: FormatToken[],
		public innerLocale: InnerLocale,
	) {}

	[Symbol.iterator]() {
		// Use a new index for each iterator. This makes multiple
		// iterations over the iterable safe for non-trivial cases,
		// such as use of break or nested looping over the same iterable.
		let index = 0

		return {
			// Note: using an arrow function allows `this` to point to the
			// one of `[@@iterator]()` instead of `next()`
			next: (): IteratorResult<FormatToken> => {
				if (index < this.formatTokens.length) {
					return { value: this.formatTokens[index++], done: false }
				} else {
					return { value: undefined, done: true }
				}
			},
		}
	}
}

type ParseResult = {
	date: Date | null
	missingPunctuation: string
}

/** Parse a string according to the supplied format tokens. Returns a date if successful, and the missing punctuation if there is any that should be after the string */
export function parse(str: string, tokens: FormatTokens, baseDate: Date | null): ParseResult {
	let missingPunctuation = ''
	let valid = true
	const shortMonthNames = tokens.innerLocale.shortMonths

	baseDate = baseDate || new Date(2020, 0, 1, 0, 0, 0, 0)
	let year = baseDate.getFullYear()
	let month = baseDate.getMonth()
	let day = baseDate.getDate()
	let hours = baseDate.getHours()
	let minutes = baseDate.getMinutes()
	let seconds = baseDate.getSeconds()
	const ms = baseDate.getMilliseconds()

	function parseString(token: string) {
		for (let i = 0; i < token.length; i++) {
			if (str.startsWith(token[i])) {
				str = str.slice(1)
			} else {
				valid = false
				if (str.length === 0) missingPunctuation = token.slice(i)
				return
			}
		}
	}

	function parseUint(pattern: RegExp, min: number, max: number) {
		const matches = str.match(pattern)
		if (matches?.[0]) {
			str = str.slice(matches[0].length)
			const n = parseInt(matches[0])
			if (n > max || n < min) {
				valid = false
				return null
			} else {
				return n
			}
		} else {
			valid = false
			return null
		}
	}

	function parseShortMonth() {
		const n = shortMonthNames.findIndex((shortMonth) => {
			return shortMonth === str.slice(0, shortMonth.length)
		})

		if (n >= 0) {
			str = str.slice(shortMonthNames[n].length)
			return n
		} else {
			valid = false
			return null
		}
	}

	function parseToken(token: FormatToken) {
		if (typeof token === 'string') {
			parseString(token)
		} else if (token.id === 'yy') {
			const value = parseUint(/^[0-9]{2}/, 0, 99)
			if (value !== null) year = 2000 + value
		} else if (token.id === 'yyyy') {
			const value = parseUint(/^[0-9]{4}/, 0, 9999)
			if (value !== null) year = value
		} else if (token.id === 'MM') {
			const value = parseUint(/^[0-9]{2}/, 1, 12)
			if (value !== null) month = value - 1
		} else if (token.id === 'MMM') {
			const value = parseShortMonth()
			if (value !== null) month = value
		} else if (token.id === 'dd') {
			const value = parseUint(/^[0-9]{2}/, 1, 31)
			if (value !== null) day = value
		} else if (token.id === 'HH') {
			const value = parseUint(/^[0-9]{2}/, 0, 23)
			if (value !== null) hours = value
		} else if (token.id === 'mm') {
			const value = parseUint(/^[0-9]{2}/, 0, 59)
			if (value !== null) minutes = value
		} else if (token.id === 'ss') {
			const value = parseUint(/^[0-9]{2}/, 0, 59)
			if (value !== null) seconds = value
		}
	}

	for (const token of tokens.formatTokens) {
		parseToken(token)
		if (!valid) break
	}

	const monthLength = getMonthLength(year, month)
	if (day > monthLength) {
		valid = false
	}

	return {
		date: valid ? new Date(year, month, day, hours, minutes, seconds, ms) : null,
		missingPunctuation: missingPunctuation,
	}
}

function twoDigit(value: number) {
	return ('0' + value.toString()).slice(-2)
}

const ruleTokens: RuleToken[] = [
	{
		id: 'yyyy',
		toString: (d: Date) => d.getFullYear().toString(),
	},
	{
		id: 'yy',
		toString: (d: Date) => d.getFullYear().toString().slice(-2),
	},
	{
		id: 'MMM',
		toString: (d: Date, l: InnerLocale) => l.shortMonths[d.getMonth()],
	},
	{
		id: 'MM',
		toString: (d: Date) => twoDigit(d.getMonth() + 1),
	},
	{
		id: 'dd',
		toString: (d: Date) => twoDigit(d.getDate()),
	},
	{
		id: 'HH',
		toString: (d: Date) => twoDigit(d.getHours()),
	},
	{
		id: 'mm',
		toString: (d: Date) => twoDigit(d.getMinutes()),
	},
	{
		id: 'ss',
		toString: (d: Date) => twoDigit(d.getSeconds()),
	},
]
function parseRule(s: string) {
	for (const token of ruleTokens) {
		if (s.startsWith(token.id)) {
			return token
		}
	}
}

export function createFormat(s: string, locale: Locale = {}): FormatTokens {
	const tokens = []
	while (s.length > 0) {
		const token = parseRule(s)
		if (token) {
			// parsed a token like "yyyy"
			tokens.push(token)
			s = s.slice(token.id.length)
		} else if (typeof tokens[tokens.length - 1] === 'string') {
			// last token is a string token, so append to it
			tokens[tokens.length - 1] += s[0]
			s = s.slice(1)
		} else {
			// add string token
			tokens.push(s[0])
			s = s.slice(1)
		}
	}

	const innerLocale = localeFromDateFnsLocale(locale)
	return new FormatTokens(tokens, innerLocale)
}
