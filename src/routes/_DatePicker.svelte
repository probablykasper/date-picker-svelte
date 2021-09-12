<script lang="ts">
  import DatePicker from '$lib/DatePicker.svelte'
  import Prop from './_prop.svelte'
  import Split from './_split.svelte'

  let placeholder: string = '2020-12-31 23:00:00'
  let value: Date = new Date()
  let years = [2018, 2019, 2020, 2021]
</script>

<Split>
  <DatePicker slot="left" bind:placeholder bind:value bind:years />
  <div slot="right">
    <h3 class="no-top">Props</h3>
    <Prop label="value">{value}</Prop>
    <Prop label="placeholder" bind:value={placeholder} />
    <Prop label="years" bind:value={years} />
  </div>
</Split>
