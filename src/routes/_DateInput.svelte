<script lang="ts">
  import DateInput from '$lib/DateInput.svelte'
  import Prop from './_prop.svelte'
  import Split from './_split.svelte'

  let defaultDate: Date
  let placeholder: string
  let value: Date
  let min: Date
  let max: Date
  let valid: boolean
  let visible: boolean
  let closeOnSelection: boolean
  let format: string
</script>

<Split>
  <DateInput
    slot="left"
    bind:value
    bind:min
    bind:max
    bind:defaultDate
    bind:placeholder
    bind:valid
    bind:format
    bind:visible
    bind:closeOnSelection
  />

  <svelte:fragment slot="right">
    <h3 class="no-top">Props</h3>
    <Prop label="value">{value}</Prop>
    <Prop label="min" bind:value={min} />
    <Prop label="max" bind:value={max} />
    <Prop label="defaultDate" bind:value={defaultDate} />
    <Prop label="placeholder" bind:value={placeholder} />
    <Prop label="valid" bind:value={valid} />
    <Prop label="format" bind:value={format} />
    <Prop label="visible" bind:value={visible} />
    <Prop label="closeOnSelection" bind:value={closeOnSelection} />
    <Prop label="locale">Default</Prop>
  </svelte:fragment>
</Split>
