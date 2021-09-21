<script lang="ts">
  import DatePicker from '$lib/DatePicker.svelte'
  import Prop from './_prop.svelte'
  import Split from './_split.svelte'

  let value = new Date()
  let min: Date
  let max: Date
</script>

<Split>
  <div class="left" slot="left">
    <DatePicker bind:value bind:min bind:max />
  </div>
  <div slot="right">
    <h3 class="no-top">Props</h3>
    <Prop label="value">{value}</Prop>
    <Prop label="min" bind:value={min} />
    <Prop label="max" bind:value={max} />
  </div>
</Split>
