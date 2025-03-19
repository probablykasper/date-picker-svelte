<script lang="ts">
	import DatePicker from '$lib/DatePicker.svelte'

	let value: Date | undefined
</script>

<button
	on:click={() => {
		value = new Date(2025, 3, 19, 11, 11, 11, 111)
	}}>chhh</button
>

<DatePicker timePrecision="minute" bind:value />

{value?.toISOString()}
