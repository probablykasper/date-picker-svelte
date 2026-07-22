<script lang="ts">
	import DatePicker from '$lib/DatePicker.svelte'
	import { localeFromDateFnsLocale } from '$lib/locale.js'
	import Prop from './prop.svelte'
	import Split from './split.svelte'
	import { hy, de, nb } from 'date-fns/locale'

	let value: Date | null = $state(null)
	const now = new Date()
	let initialBrowseDate = $state(now)
	let min = $state(new Date(now.getFullYear() - 20, 0, 1))
	let max = $state(new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999))
	let locales = [
		{ key: 'default', value: localeFromDateFnsLocale({}) },
		{ key: 'nb (date-fns)', value: localeFromDateFnsLocale(nb) },
		{ key: 'de (date-fns)', value: localeFromDateFnsLocale(de) },
		{ key: 'hy (date-fns)', value: localeFromDateFnsLocale(hy) },
	]
	let locale = $state(locales[3])
	let browseWithoutSelecting = $state(false)
	let timePrecision: 'minute' | 'second' | 'millisecond' | null = $state('millisecond')
</script>

<Split>
	<div class="left" slot="left">
		<DatePicker
			bind:value
			{initialBrowseDate}
			{min}
			{max}
			locale={locale.value}
			{browseWithoutSelecting}
			{timePrecision}
		/>
	</div>
	<div slot="right">
		<h3 class="no-top">Props</h3>
		<Prop label="value">{value}</Prop>
		<Prop label="initialBrowseDate" bind:value={initialBrowseDate} />
		<Prop label="min" bind:value={min} />
		<Prop label="max" bind:value={max} />
		<Prop label="locale" bind:value={locale} values={locales} />
		<Prop label="browseWithoutSelecting" bind:value={browseWithoutSelecting} />
		<Prop
			label="timePrecision"
			bind:value={timePrecision}
			values={[null, 'minute', 'second', 'millisecond']}>{timePrecision}</Prop
		>
		<Prop label="isDisabledDate">
			<span style="font-family:monospace">(date: Date) =&gt; boolean</span>
		</Prop>
		<Prop label="onselect">
			<span style="font-family:monospace">(date: Date) =&gt; void</span>
		</Prop>
	</div>
</Split>
