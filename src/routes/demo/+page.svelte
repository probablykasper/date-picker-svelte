<script lang="ts">
	import DemoDatePicker from '../DemoDatePicker.svelte'
	import DemoDateInput from '../DemoDateInput.svelte'
</script>

<svelte:head>
	<title>Demo • Date Picker Svelte</title>
</svelte:head>

<!-- svelte-ignore a11y_consider_explicit_label -->
<a id="Demo"></a>
<h1>Demo</h1>

<!-- svelte-ignore a11y_consider_explicit_label -->
<a id="DateInput"></a>
<h2>DateInput</h2>
<DemoDateInput />

<!-- svelte-ignore a11y_consider_explicit_label -->
<a id="DatePicker"></a>
<h2>DatePicker</h2>
<DemoDatePicker />
