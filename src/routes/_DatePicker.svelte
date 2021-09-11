<script lang="ts">
  import DatePicker from '$lib/DatePicker.svelte'
  import Prop from './_prop.svelte'

  let placeholder: string = '2020-12-31 23:00:00'
  let value: Date = new Date()
  let years = [2018, 2019, 2020, 2021]
</script>

<div class="row">
  <div class="left">
    <DatePicker bind:placeholder bind:value bind:years />
  </div>
  <div class="right">
    <h3 class="no-top">Props</h3>
    <Prop label="value">{value}</Prop>
    <Prop label="placeholder" bind:value={placeholder} />
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
