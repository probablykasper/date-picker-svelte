<script lang="ts">
  import DateInput from '$lib/DateInput.svelte'

  export let value: any = null
  export let label: string
  let jsonValue = JSON.stringify(value)
  $: () => {
    jsonValue = JSON.stringify(value)
  }
  function jsonInput() {
    try {
      value = JSON.parse(jsonValue)
    } catch (e) {}
  }
</script>

<div class="prop">
  <div class="label">{label}</div>
  {#if typeof value === 'string'}
    <input type="text" bind:value />
  {:else if typeof value === 'boolean'}
    <input type="checkbox" bind:checked={value} />
  {:else if value instanceof Array}
    <textarea type="text" bind:value={jsonValue} on:input={jsonInput} />
  {:else if value instanceof Date}
    <DateInput bind:value />
  {:else}
    <div>
      <slot />
    </div>
  {/if}
</div>

<style lang="sass">
  .prop
    display: flex
    padding: 5px 0px
  .label
    display: inline-block
    width: 100px
    flex-shrink: 0
  input[type='text']
    color: var(--foreground)
    background-color: var(--input-background)
    border: 1px solid rgba(103, 113, 137, 0.3)
    border-radius: 3px
    box-sizing: border-box
    padding: 4px 6px
    width: var(--input-width)
    outline: none
    transition: all 80ms ease-in-out
    &:focus
      border-color: var(--input-highlight-border)
      box-shadow: 0px 0px 0px 2px var(--input-highlight-shadow)
</style>
