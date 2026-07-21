<script lang="ts">
	import DateInput from '$lib/DateInput.svelte'

	let min = $state(new Date(2024, 1, 26, 17, 30))
	let value: Date | undefined = $state()
</script>

<DateInput
	timePrecision="minute"
	{min}
	bind:value
	isDisabledDate={(date) => {
		return date.getDate() === 15 || date.getDate() === 16
	}}
/>
<button
	onclick={() => {
		value = new Date(2024, 10, 15)
	}}>Set to 2024-10-15</button
>

{value}
