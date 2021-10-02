<script lang="ts">
  import DatePicker from '$lib/DatePicker.svelte'
  import { localeFromDateFnsLocale } from '$lib'
  import Prop from './_prop.svelte'
  import Split from './_split.svelte'

  // had to import it this way to avoid errors
  // in `npm run build:site` or `npm run check`:
  import hy from 'date-fns/locale/hy/index.js'

  let value: Date
  let min: Date
  let max: Date
  let locale = localeFromDateFnsLocale(hy)
</script>

<Split>
  <div class="left" slot="left">
    <DatePicker bind:value bind:min bind:max {locale} />
  </div>
  <div slot="right">
    <h3 class="no-top">Props</h3>
    <Prop label="value">{value}</Prop>
    <Prop label="min" bind:value={min} />
    <Prop label="max" bind:value={max} />
    <Prop label="locale">date-fns <code>hy</code></Prop>
  </div>
</Split>
