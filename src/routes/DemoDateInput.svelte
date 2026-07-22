<script lang="ts">
	import DateInput from '$lib/DateInput.svelte'
	import Prop from './prop.svelte'
	import Split from './split.svelte'
	import { localeFromDateFnsLocale } from '$lib'
	import { hy, de, nb } from 'date-fns/locale'

	let value: Date | null = $state(null)
	const now = new Date()
	let initialBrowseDate = $state(now)
	let min = $state(new Date(now.getFullYear() - 20, 0, 1))
	let max = $state(new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999))
	let id: string | null = $state(null)
	let placeholder = $state('2020-12-31 23:00:00')
	let valid = $state(true)
	let disabled = $state(false)
	let required = $state(false)
	let classes = $state('')
	// let locale = $state({})
	let format = $state('yyyy-MM-dd HH:mm:ss')
	// let isDisabledDate = $state(null)
	// let text = $state(toText(
	// 	value ? toValidDate(initialBrowseDate, value, min, max, isDisabledDate) : value,
	// 	createFormat(format, locale),
	// ))
	let visible = $state(false)
	let closeOnSelection = $state(false)
	let browseWithoutSelecting = $state(false)
	let timePrecision: 'second' | 'minute' | 'millisecond' | null = $state(null)
	let dynamicPositioning = $state(true)

	let locales = [
		{ key: 'default', value: localeFromDateFnsLocale({}) },
		{ key: 'nb (date-fns)', value: localeFromDateFnsLocale(nb) },
		{ key: 'de (date-fns)', value: localeFromDateFnsLocale(de) },
		{ key: 'hy (date-fns)', value: localeFromDateFnsLocale(hy) },
	]
	let locale = $state(locales[0])
</script>

<Split>
	<DateInput
		slot="left"
		{id}
		bind:value
		{initialBrowseDate}
		{min}
		{max}
		{placeholder}
		bind:valid
		{format}
		bind:visible
		{disabled}
		{required}
		{closeOnSelection}
		{browseWithoutSelecting}
		{dynamicPositioning}
		{timePrecision}
		locale={locale.value}
		class={classes}
	/>

	<svelte:fragment slot="right">
		<h3 class="no-top">Props</h3>
		<Prop label="value">{value}</Prop>
		<Prop label="initialBrowseDate" bind:value={initialBrowseDate} />
		<Prop label="min" bind:value={min} />
		<Prop label="max" bind:value={max} />
		<Prop label="id" bind:value={id} />
		<Prop label="placeholder" bind:value={placeholder} />
		<Prop label="valid" bind:value={valid} />
		<Prop label="format" bind:value={format} />
		<Prop label="visible" bind:value={visible} />
		<Prop label="disabled" bind:value={disabled} />
		<Prop label="required" bind:value={required} />
		<Prop label="closeOnSelection" bind:value={closeOnSelection} />
		<Prop label="browseWithoutSelecting" bind:value={browseWithoutSelecting} />
		<Prop label="dynamicPositioning" bind:value={dynamicPositioning} />
		<Prop label="locale" bind:value={locale} values={locales} />
		<Prop
			label="timePrecision"
			bind:value={timePrecision}
			values={[null, 'minute', 'second', 'millisecond']}>{timePrecision}</Prop
		>
		<Prop label="class" bind:value={classes} />
	</svelte:fragment>
</Split>
