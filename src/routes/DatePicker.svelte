<script lang="ts">
	import DatePicker from '$lib/DatePicker.svelte'
	import { localeFromDateFnsLocale } from '$lib/locale.js'
	import Prop from './prop.svelte'
	import Split from './split.svelte'

	// had to import it this way to avoid errors
	// in `npm run build:site` or `npm run check`:
	import hy from 'date-fns/locale/hy/index'
	import de from 'date-fns/locale/de/index'
	import nb from 'date-fns/locale/nb/index'

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
	</div>
</Split>
