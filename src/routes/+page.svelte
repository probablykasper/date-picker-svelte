<script lang="ts">
	import DemoDatePicker from './DemoDatePicker.svelte'
	import DemoDateInput from './DemoDateInput.svelte'
	import { Color } from 'color-picker-svelte'
	import Prop from './prop.svelte'

	function readCssVar(name: string) {
		const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
		return new Color(value)
	}

	function getCssVars(): Record<string, Color | null> {
		if (typeof document === 'undefined') {
			return {}
		}
		return {
			'--date-picker-foreground': readCssVar('--date-picker-foreground'),
			'--date-picker-background': readCssVar('--date-picker-background'),
			'--date-picker-highlight-border': readCssVar('--date-picker-highlight-border'),
			'--date-picker-highlight-shadow': readCssVar('--date-picker-highlight-shadow'),
			'--date-picker-today-border': readCssVar('--date-picker-today-border'),
			'--date-picker-selected-color': readCssVar('--date-picker-selected-color'),
			'--date-picker-selected-background': readCssVar('--date-picker-selected-background'),
		}
	}

	let cssVars = $state(getCssVars())

	$effect(() => {
		const observer = new MutationObserver(async () => {
			cssVars = getCssVars()
		})
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme'],
		})
		return () => observer.disconnect()
	})
</script>

<svelte:head>
	<title>Date Picker Svelte</title>
</svelte:head>

<p>Date and time picker for Svelte</p>

<p>Features:</p>
<ul>
	<li>Theming</li>
	<li>Custom formats</li>
	<li>Internationalization (i18n)</li>
	<li>
		Autopunctuation (e.g typing "20201111111111" gives you "2020-11-11 11:11:11" with the default
		format)
	</li>
	<li>Keyboard shortcuts</li>
</ul>

<h2 id="install">Install</h2>
<pre class="language-">npm install -D date-picker-svelte</pre>

<div
	style={Object.entries(cssVars)
		.map(([key, value]) => {
			if (value === null) {
				return null
			}
			return `${key}: ${value.toHex8String()};`
		})
		.join('')}
>
	<h2 id="dateinput">DateInput</h2>
	<DemoDateInput />

	<h2 id="datepicker">DatePicker</h2>
	<DemoDatePicker />
</div>

<h2>Theming</h2>

<div class="theming">
	<Prop
		label="--date-picker-foreground"
		labelWide
		bind:value={cssVars['--date-picker-foreground']}
	/>
	<Prop
		label="--date-picker-background"
		labelWide
		bind:value={cssVars['--date-picker-background']}
	/>
	<Prop
		label="--date-picker-highlight-border"
		labelWide
		bind:value={cssVars['--date-picker-highlight-border']}
	/>
	<Prop
		label="--date-picker-highlight-shadow"
		labelWide
		bind:value={cssVars['--date-picker-highlight-shadow']}
	/>
	<Prop
		label="--date-picker-today-border"
		labelWide
		bind:value={cssVars['--date-picker-today-border']}
	/>
	<Prop
		label="--date-picker-selected-color"
		labelWide
		bind:value={cssVars['--date-picker-selected-color']}
	/>
	<Prop
		label="--date-picker-selected-background"
		labelWide
		bind:value={cssVars['--date-picker-selected-background']}
	/>
</div>
