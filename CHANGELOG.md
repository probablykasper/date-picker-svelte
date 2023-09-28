# Changelog

## Next
- Add date to `select` event detail

## 2.7.0 - 2023 Sep 23
- Add `dynamicPositioning` prop to avoid the date popup appearing outside the screen (@stinger567)
- `DateInput`: Avoid errors when `undefined` is passed as value (@happysalada)

## 2.6.0 - 2023 Jul 11
- Add 'yy' format (@erezarnon)

## 2.5.1 - 2023 Jul 2
- Fix wrong version published

## 2.5.0 - 2023 Jul 2
- Add Svelte 4 support

## 2.4.3 - 2023 May 3
- Fix Firefox autopunctuation

## 2.4.2 - 2023 Apr 29
- Fix blank date picker when no date is selected and current date is outside min/max range

## 2.4.1 - 2023 Apr 29
- Fix browsing not working with `browseWithoutSelecting` when a date is selected

## 2.4.0 - 2023 Apr 29
- Add `class` prop (@jdtjenkins)
- Fix vite-plugin-svelte resolve config conflict warning

## 2.3.0 - 2023 Mar 9
- Outline today in the date picker (@VladimirLakodei)

## 2.2.5 - 2022 Dec 13
- Fix month/year not updating when `value` is assigned to

## 2.2.4 - 2022 Dec 1
- Fix buttons causing form submissions

## 2.2.3 - 2022 Nov 10
- Improve Tailwind compatibility

## 2.2.2 - 2022 Nov 10
- Fix accessibility hints
- Improve Tailwind compatibility

## 2.2.1 - 2022 Oct 24
- Fix month dropdown left/right arrow shortcuts

## 2.2.0 - 2022 Sep 6
- Add `disabled` property

## 2.1.1 - 2022 Aug 15
- Fix broken month dropdown on Firefox
- Fix unreliable clamping to min/max dates
- Fix month `Up/Down` arrow key shortcuts

## 2.1.0 - 2022 Jul 31
- Add `browseWithoutSelecting` property
- Use well-supported `:focus` instead of `:focus-within`

## 2.0.0 - 2021 Feb 17
- **Breaking**: Allow DateInput/DatePicker value to be `null`
- **Breaking**: The value is now `null` by default
- Use `rem` for sizing the DatePicker
- Make the DatePicker slightly larger
- Make the calendar tabbable
- Add `Shift/Alt+Up/Down` shortcut for changing year
- Add `Shift/Alt+Left/Right` shortcut for changing month
- Fix styling issue for languages with long month names

## 1.3.0 - 2021 Jan 4
- Add `closeOnSelection` property for DateInput

## 1.2.0 - 2021 Dec 22
- Hide disabled dates
- Fix disabled dates not reacting to `min` and `max` being updated

## 1.1.1 - 2021 Dec 11
- Fix some dates showing as wrong weekdays
- Fix invalid input fields resetting when clicked

## 1.1.0 - 2021 Oct 19
- Add `Escape` shortcut for closing DatePicker popup
- Add `Enter` shortcut for opening/closing DatePicker popup

## 1.0.0 - 2021 Oct 6
- Replace all `any` types

## 0.2.1 - 2021 Oct 2
- Fix invisible dropdown menu in dark mode on Windows Chrome
- Fix flash of incorrect month/year value on page load

## 0.2.0 - 2021 Oct 2
- Add internationalization support, including setting the first day of the week. Can be configured manually as well as using `date-fns`.

## 0.1.1 - 2021 Oct 2
- Fix dates showing under the wrong weekday
- Fix `--date-input-width` not working

## 0.1.0 - 2021 Sep 30
- Initial release
