<script lang="ts">
  import DatePicker from './_DatePicker.svelte'
  import DateInput from './_DateInput.svelte'
</script>

<h1>Svelte Date Picker</h1>
<p>Date and time picker for Svelte</p>

<h2>DateInput</h2>
<DateInput />

<h2>DatePicker</h2>
<DatePicker />

<style lang="sass">
  :global(body)
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif
    max-width: 800px
    margin: auto
</style>
