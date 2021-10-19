import { describe, expect, test } from '@jest/globals'

import { getCalendarDays, getMonthDays } from '../src/lib/date-utils'
import { createFormat, parse } from '../src/lib/parse'

describe('date-utils', () => {
  test('getMonthDays', () => {
    const feb2021 = getMonthDays(2021, 1)
    expect(feb2021.length).toEqual(28)
  })
  test('getMonthDays leap year', () => {
    const feb2020 = getMonthDays(2020, 1)
    expect(feb2020.length).toEqual(29)
  })
  test('getCalendarDays', () => {
    const feb2020 = new Date(2020, 0, 1, 0, 0, 0, 0)
    const calDays = getCalendarDays(feb2020, 1)
    expect(calDays).toEqual([
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
  })
})

test('formatting', () => {
  const tokens = createFormat('MM-dd HH:mm:ss')
  const baseDate = new Date(1234, 0, 1, 0, 0, 0, 999)
  const parsedDate = parse('12-31 23:59:59', tokens, baseDate)
  expect(parsedDate.date).toEqual(new Date(1234, 11, 31, 23, 59, 59, 999))
})
