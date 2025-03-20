<script lang="ts">
	import DatePicker from '$lib/DatePicker.svelte'

	let min = new Date(2024, 1, 26, 17, 30)
	let value: Date | undefined
</script>

<DatePicker
	timePrecision="minute"
	{min}
	bind:value
	isDisabledDate={(date) => {
		return date.getDate() === 15 || date.getDate() === 16
	}}
/>

{value}
