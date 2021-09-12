<script lang="ts">
  import DateInput from '$lib/DateInput.svelte'
  import Prop from './_prop.svelte'
  import Split from './_split.svelte'

  let placeholder = '2020-12-31 23:00:00'
  let value = new Date()
  let valid = true
  let visible = false
  let width = '140px'
  let format = 'yyyy-MM-dd HH:mm:ss'
  let years = [2018, 2019, 2020, 2021]
  $: console.log(years)
</script>

<Split>
  <DateInput
    slot="left"
    bind:placeholder
    bind:value
    bind:valid
    bind:visible
    bind:width
    bind:format
    bind:years />

  <svelte:fragment slot="right">
    <h3 class="no-top">Props</h3>
    <Prop label="value">{value}</Prop>
    <Prop label="placeholder" bind:value={placeholder} />
    <Prop label="valid" bind:value={valid} />
    <Prop label="visible" bind:value={visible} />
    <Prop label="width" bind:value={width} />
    <Prop label="format" bind:value={format} />
    <Prop label="years" bind:value={years} />
  </svelte:fragment>
</Split>

<style lang="sass">
  .no-top
    // margin-top: 0px
</style>
