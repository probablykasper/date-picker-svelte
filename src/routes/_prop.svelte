<script lang="ts">
  export let value: any = null
  export let label: string
  let jsonValue = JSON.stringify(value)
  $: () => {
    console.log('X')
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
  {:else}
    <slot />
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
</style>
