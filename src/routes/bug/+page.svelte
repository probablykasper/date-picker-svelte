<script lang="ts">
	import DatePicker from '$lib/DatePicker.svelte'

	let date: Date | null = new Date()
	// let date_string: string | undefined
	let is_date_valid: boolean
	let max_date = new Date()

	// Atleast 14 years old
	max_date.setDate(max_date.getDate() - 5110)

	$: if (date && is_date_valid) {
		date.setHours(12, 0, 0, 0)
		date.toISOString()
		// date_string = date.toISOString().slice(0, 10)
	}
</script>

<button
	type="button"
	on:click={() => {
		date?.setMonth(date.getMonth() - 1)
		date = date
	}}>Subtract 1 month</button
>
<!-- <input bind:value={date_string} type="date" class="hidden" id="id_birth_date" name="birth_date" /> -->
<!-- <DateInput
	bind:value={date}
	bind:valid={is_date_valid}
	max={max_date}
	format="yyyy-MM-dd"
	placeholder="Select a date"
/> -->
<DatePicker bind:value={date} max={max_date} browseWithoutSelecting={true} />
