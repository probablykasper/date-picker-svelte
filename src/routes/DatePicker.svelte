<script lang="ts">
	import { isSameDate } from '$lib/date-utils'
	import DatePicker from '$lib/DatePicker.svelte'
	import { localeFromDateFnsLocale } from '$lib/locale.js'
	import Prop from './prop.svelte'
	import Split from './split.svelte'
	import { hy, de, nb } from 'date-fns/locale'

	let value: Date
	let min: Date
	let max: Date
	let locales = [
		{ key: 'default', value: localeFromDateFnsLocale({}) },
		{ key: 'nb (date-fns)', value: localeFromDateFnsLocale(nb) },
		{ key: 'de (date-fns)', value: localeFromDateFnsLocale(de) },
		{ key: 'hy (date-fns)', value: localeFromDateFnsLocale(hy) },
	]
	let locale = locales[3]
	let browseWithoutSelecting: boolean
	let timePrecision: 'minute' | 'second' | 'millisecond' | null = 'millisecond'
	let disabledDay1 = new Date()
	let disabledDay2 = new Date(disabledDay1)
	disabledDay2.setDate(disabledDay1.getDate() + 1)
	let disabledDates = [disabledDay1, disabledDay2].filter((d) => d !== undefined)

	function isDisabledDate(date: Date): boolean {
		for (const disabledDate of disabledDates) {
			if (isSameDate(date, disabledDate)) {
				return true
			}
		}
		return false
	}
</script>

<Split>
	<div class="left" slot="left">
		<DatePicker
			bind:value
			bind:min
			bind:max
			locale={locale.value}
			bind:browseWithoutSelecting
			{timePrecision}
			{isDisabledDate}
		/>
	</div>
	<div slot="right">
		<h3 class="no-top">Props</h3>
		<Prop label="value">{value}</Prop>
		<Prop label="min" bind:value={min} />
		<Prop label="max" bind:value={max} />
		<Prop label="locale" bind:value={locale} values={locales} />
		<Prop label="browseWithoutSelecting" bind:value={browseWithoutSelecting} />
		<Prop
			label="timePrecision"
			bind:value={timePrecision}
			values={[null, 'minute', 'second', 'millisecond']}>{timePrecision}</Prop
		>
		{#each disabledDates as day, index}
			<Prop label="disabledDate {index + 1}" bind:value={day} />
		{/each}
	</div>
</Split>
