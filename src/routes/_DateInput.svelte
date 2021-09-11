<script lang="ts">
  import DateInput from '$lib/DateInput.svelte'
  import Prop from './_prop.svelte'

  let placeholder = '2020-12-31 23:00:00'
  let value = new Date()
  let isValid = true
  let visible = false
  let width = '140px'
  let format = 'yyyy-MM-dd HH:mm:ss'
  let years = [2018, 2019, 2020, 2021]
  $: console.log(years)
</script>

<div class="row">
  <div class="left">
    <DateInput
      bind:placeholder
      bind:value
      bind:isValid
      bind:visible
      bind:width
      bind:format
      bind:years />
  </div>
  <div class="right">
    <h3 class="no-top">Props</h3>
    <Prop label="value">{value}</Prop>
    <Prop label="placeholder" bind:value={placeholder} />
    <Prop label="isValid" bind:value={isValid} />
    <Prop label="visible" bind:value={visible} />
    <Prop label="width" bind:value={width} />
    <Prop label="format" bind:value={format} />
    <Prop label="years" bind:value={years} />
  </div>
</div>

<style lang="sass">
  .row
    display: flex
    .left
      padding: 20px
      min-width: 250px
    .right
      padding: 20px
  .no-top
    margin-top: 0px
</style>
