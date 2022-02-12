<svelte:head>
  <title>Docs • Date Picker Svelte</title>
</svelte:head>

# Documentation

## Install
```
npm install -D date-picker-svelte
```

## Usage

```svelte
<script>
  import { DateInput } from 'date-picker-svelte'
  let date = new Date()
</script>

<DateInput bind:value={date} />
```

## DateInput

Component with an input field that shows the DatePicker component on focus. 
The component will not assign a date value until a specific date is selected in the picker or entered into the field.

### Props

| Prop                  | Type   | Description                                                                 |
|:----------------------|:-------|:----------------------------------------------------------------------------|
| `value`               | Date   | Date value                                                                  |
| `min`                 | Date   | The earliest value the user can select                                      |
| `max`                 | Date   | The latest value the user can select                                        |
| `placeholder`         | string | Placeholder used when date value is null                                    |
| `valid`               | bool   | Whether the text is valid                                                   |
| `format`              | string | Format string                                                               |
| `visible`             | bool   | Whether the date popup is visible                                           |
| `closeOnSelection`    | bool   | Close the date popup when a date is selected                                |
| `locale`              | Locale | Locale object for internationalization                                      |

#### Format string

Example format string: `yyyy-MM-dd HH:mm:ss`

| Pattern | Result example |
| :------ | :------------- |
| `yyyy`  | 2021           |
| `MM`    | 12             |
| `dd`    | 31             |
| `HH`    | 23             |
| `mm`    | 59             |
| `ss`    | 59             |

## DatePicker

Component with a calendar for choosing a date.
The component will not assign a date value until a specific date is selected in the picker.

### Props

| Prop                 | Type   | Description                            |
|:---------------------| :----- | :------------------------------------- |
| `value`              | Date   | Date value                             |
| `min`                | Date   | The earliest year the user can select  |
| `max`                | Date   | The latest year the user can select    |
| `locale`             | Locale | Locale object for internationalization |

## Internationalization

### `Locale`

Object to support internationalization. Properties (all are optional):

- `weekdays`: Array of weekdays in short form, Sunday to Monday. Default: `['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']`
- `months`: Array of month names, January to December. Default: `['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']`
- `weekStartsOn`: The day the week starts on, 0 = Sunday. Default: `1`

### `localeFromDateFnsLocale`

If you use [date-fns](https://date-fns.org/), you can create a Locale object by passing a date-fns locale to this function:

```js
<script>
  import { DatePicker, localeFromDateFnsLocale } from 'date-picker-svelte'
  import { hy } from 'date-fns/locale'
  let date = new Date()
  let locale = localeFromDateFnsLocale(hy)
</script>

<DatePicker bind:value={date} {locale} />
```

## CSS variables

Colors:

- `--date-picker-foreground`
- `--date-picker-background`
- `--date-picker-highlight-border`
- `--date-picker-highlight-shadow`
- `--date-picker-selected-color`
- `--date-picker-selected-background`

Lengths:

- `--date-input-width`

Dark theme example:

```css
:root {
  --date-picker-background: #1b1e27;
  --date-picker-foreground: #f7f7f7;
}
```
