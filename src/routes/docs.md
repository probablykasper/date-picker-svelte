# Docs

## Usage

```svelte
<script>
  import { DateInput } from 'svelte-date-picker'
  let date = new Date()
</script>

<DateInput bind:value={date} />
```

## <a name="DateInput"></a> DateInput

### Props

Has all the props that [DatePicker](#DatePicker) has, plus:

| Prop          | Type   | Description |
| :------------ | :----- | :---------- |
| `valid`       | bool   | Whether or not the text is valid |
| `visible`     | bool   | Whether the date popup is visible |
| `width`       | string | Input field width |
| `format`      | string | Format string |


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

## <a name="DatePicker"></a> DatePicker

### Props

| Prop          | Type           | Description |
| :------------ | :------------- | :---------- |
| `placeholder` | string   | Placeholder |
| `value`       | string   | Placeholder |
| `years`       | number[] | Years to show in the year dropdown |

