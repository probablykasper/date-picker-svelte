<script lang="ts">
	import DateInput from '$lib/DateInput.svelte'

	export let value: unknown = undefined
	export let values: unknown[] | undefined = undefined
	export let label: string
	let jsonValue = ''
	$: if (value instanceof Object) {
		jsonValue = JSON.stringify(value)
	}
	function jsonInput() {
		try {
			value = JSON.parse(jsonValue)
		} catch (e) {
			console.error(e)
		}
	}
</script>

<div class="prop">
	<div class="label">{label}</div>
	{#if values}
		<select bind:value>
			{#each values as value}
				{#if value && typeof value === 'object' && 'key' in value && 'value' in value}
					<option {value}>{String(value.key)}</option>
				{:else}
					<option {value}>{String(value)}</option>
				{/if}
			{/each}
		</select>
	{:else if typeof value === 'string'}
		<input type="text" bind:value />
	{:else if typeof value === 'boolean'}
		<input type="checkbox" bind:checked={value} />
	{:else if value instanceof Date}
		<DateInput
			bind:value
			min={new Date(new Date().getFullYear() - 20, 0)}
			max={new Date(new Date().getFullYear() + 5, 0)}
			dynamicPositioning
		/>
	{:else if value instanceof Object}
		<textarea bind:value={jsonValue} on:input={jsonInput}></textarea>
	{:else}
		<div>
			<slot />
		</div>
	{/if}
</div>

<style lang="sass">
	.prop
		padding: 5px 0px
		align-items: center
		display: block
		@media (min-width: 450px)
			display: flex
	.label
		width: 195px
		flex-shrink: 0
	input[type='text'], textarea, select
		color: var(--foreground)
		background: var(--input-background)
		border: 1px solid rgba(103, 113, 137, 0.3)
		border-radius: 3px
		box-sizing: border-box
		padding: 4px 6px
		outline: none
		transition: 80ms cubic-bezier(0.4, 0.0, 0.2, 1)
		transition-property: border-color, box-shadow, background
		&:focus
			border-color: var(--input-highlight-border)
			box-shadow: 0px 0px 0px 2px var(--input-highlight-shadow)
	input[type='text']
		width: var(--input-width)
</style>
