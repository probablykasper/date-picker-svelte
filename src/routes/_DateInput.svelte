<script lang="ts">
  import DateInput from '$lib/DateInput.svelte'
  import Prop from './_prop.svelte'
  import Split from './_split.svelte'

  let placeholder = '2020-12-31 23:00:00'
  let value = new Date()
  let min: Date
  let max: Date
  let valid = true
  let visible = false
  let width = '140px'
  let format = 'yyyy-MM-dd HH:mm:ss'
</script>

<Split>
  <DateInput
    slot="left"
    bind:value
    bind:min
    bind:max
    bind:placeholder
    bind:valid
    bind:width
    bind:format
    bind:visible />

  <svelte:fragment slot="right">
    <h3 class="no-top">Props</h3>
    <Prop label="value">{value}</Prop>
    <Prop label="min" bind:value={min} />
    <Prop label="max" bind:value={max} />
    <Prop label="placeholder" bind:value={placeholder} />
    <Prop label="valid" bind:value={valid} />
    <Prop label="width" bind:value={width} />
    <Prop label="format" bind:value={format} />
    <Prop label="visible" bind:value={visible} />
  </svelte:fragment>
</Split>
