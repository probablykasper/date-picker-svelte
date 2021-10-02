# Docs

## Usage

```svelte
<script>
  import { DateInput } from 'date-picker-svelte'
  let date = new Date()
</script>

<DateInput bind:value={date} />
```

## DateInput

### Props

| Prop          | Type   | Description |
| :------------ | :----- | :---------- |
| `value`       | Date   | Date value |
| `min`         | Date   | The earliest value the user can select |
| `max`         | Date   | The latest value the user can select |
| `placeholder` | string | Placeholder |
| `valid`       | bool   | Whether the text is valid |
| `format`      | string | Format string |
| `visible`     | bool   | Whether the date popup is visible |
| `locale`      | Locale | Locale object for internationalization |


#### Format string

Example format string: `yyyy-MM-dd HH:mm:ss`

| Pattern    | Result example
| :--------- | :-------------
| `yyyy`     | 2021
| `MM`       | 12
| `dd`       | 31
| `HH`       | 23
| `mm`       | 59
| `ss`       | 59

## DatePicker

### Props

| Prop          | Type   | Description |
| :------------ | :----- | :---------- |
| `value`       | Date   | Date value |
| `min`         | Date   | The earliest year the user can select |
| `max`         | Date   | The latest year the user can select |
| `locale`      | Locale | Locale object for internationalization |

## Types

### <a name="locale"></a>`Locale`
Object with the following properties:
- `weekdays`: Array of weekdays in short form, Sunday to Monday
- `months`: Array of month names, January to December
- `firstDayOfWeek`: The day the week starts on, 0 = Sunday

Default:
```js
{
  months: ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'],
  weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  firstDayOfWeek: 1,
}
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
