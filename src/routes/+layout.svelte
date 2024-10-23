<script lang="ts">
	import { onMount } from 'svelte'

	let systemTheme: string | null = null
	onMount(() => {
		const prefersDarkMQ = matchMedia('(prefers-color-scheme: dark)')
		systemTheme = prefersDarkMQ.matches ? 'dark' : 'light'
		prefersDarkMQ.onchange = (e) => {
			// Keep the systemTheme variable up to date
			systemTheme = e.matches ? 'dark' : 'light'
			// Update the theme, as long as there's no theme override
			if (localStorage.getItem('theme') === null) {
				setTheme(systemTheme)
			}
		}
	})

	let theme = 'dark'
	if (typeof document === 'object') {
		theme = document.documentElement.getAttribute('data-theme') || 'dark'
	}
	function setTheme(newTheme: string) {
		document.documentElement.setAttribute('data-theme', newTheme)
		theme = newTheme
		if (newTheme === systemTheme) {
			// Remove override if the user sets the theme to match
			localStorage.removeItem('theme')
		} else {
			localStorage.setItem('theme', newTheme)
		}
	}
	function toggleTheme() {
		if (theme === 'dark') {
			setTheme('light')
		} else {
			setTheme('dark')
		}
	}
</script>

<div class="layout">
	<header>
		<div class="left">
			<a class="header-title" href="/">Date Picker Svelte</a>
			<div class="links">
				<a class="nav-link" href="/demo">Demo</a>
				<a class="nav-link" href="/docs">Docs</a>
				<a
					class="nav-link"
					href="https://svelte.dev/repl/044911429c4b4e659362518d9a5deaae?version=4">REPL</a
				>
			</div>
		</div>
		<div class="icons">
			<a
				aria-label="GitHub repository"
				class="icon github"
				href="https://github.com/probablykasper/date-picker-svelte"
			>
				<svg height="24" viewBox="-2 -2 28 28" width="24" xmlns="http://www.w3.org/2000/svg"
					><path
						d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
						fill="none"
						stroke="#000"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
					/></svg
				>
			</a>
			<button
				aria-label="Toggle theme"
				type="button"
				class="icon theme-toggle"
				on:click={toggleTheme}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					enable-background="new 0 0 24 24"
					viewBox="0 0 24 24"
					height="24px"
					width="24px"
					><rect fill="none" height="24" width="24" /><path
						d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"
					/></svg
				>
			</button>
		</div>
	</header>
	<div class="page">
		<slot />
	</div>
</div>

<style lang="sass">
	:global(:root)
		--primary: #1a79ff
		--input-highlight-border: rgb(2, 105, 247)
		--input-highlight-shadow: rgba(2, 105, 247, 0.5)
		--input-width: 150px
		--date-input-width: var(--input-width)
		color: var(--foreground)
		transition: background 80ms cubic-bezier(0.4, 0.0, 0.2, 1)
	:global([data-theme='dark'])
		--foreground: #f7f7f7
		--background: #0d0e12
		--card-background: var(--background)
		--border: #1f2228
		--input-background: #1b1e27
		--date-picker-background: #1b1e27
		--date-picker-foreground: var(--foreground)
		--date-picker-highlight-border: var(--input-highlight-border)
		--date-picker-highlight-shadow: var(--input-highlight-shadow)
		color-scheme: dark
		background: var(--background)
	:global([data-theme='light'])
		--foreground: #0d0e12
		--background: #f6f9fe
		--card-background: #ffffff
		--border: #c6cddd
		--input-background: #ffffff
		color-scheme: light
		background: var(--background)
	:global(html)
		min-height: 100%
	:global(body)
		font-family: Inter, sans-serif
		margin: 0px
	:global(a)
		color: #3370ff
		text-decoration: none
	.layout
		transition: all 80ms cubic-bezier(0.4, 0.0, 0.2, 1)
		min-height: 100vh
	header
		display: flex
		align-items: center
		height: 80px
		padding: 5px 30px
		margin-bottom: 25px
		background-color: hsla(234, 20%, 70%, 0.07)
		border-bottom: 1px solid hsla(234, 10%, 50%, 0.1)
		@media screen and (min-width: 560px)
			height: 60px
		.left
			display: flex
			flex-direction: column
			@media screen and (min-width: 560px)
				flex-direction: row
		.links
			display: flex
			align-items: center
		.icons
			display: flex
			margin-left: auto
			align-items: center
	.page
		max-width: 800px
		margin: auto
		padding-bottom: 100px
		padding: 0px 15px
		@media (min-width: 400px)
			padding: 0px 30px
	.header-title
		color: var(--primary)
		font-weight: 500
		font-size: 1.5em
		margin-right: 20px
		padding: 2px 0px
	:global(h1)
		font-size: 2em
	:global(h1, h2)
		margin-block-start: 0.9em
		margin-block-end: 0.9em
	:global(::selection)
		background: var(--primary)
		color: #ffffff
	a
		color: inherit
		user-select: none
	a, button.theme-toggle
		-webkit-tap-highlight-color: transparent
		-moz-tap-highlight-color: rgba(0, 0, 0, 0)
		&:hover
			opacity: 0.7
	a.nav-link
		padding: 5px 2px
		margin-right: 16px
		transition: all 80ms cubic-bezier(0.4, 0.0, 0.2, 1)
	.icon
		display: block
		border: none
		background-color: transparent
		padding: 5px 2px
		margin: 0px 5px
		cursor: pointer
		svg
			display: block
			transition: all 80ms cubic-bezier(0.4, 0.0, 0.2, 1)
		&.theme-toggle svg
			fill: var(--foreground)
		&.github svg > path
			transition: all 80ms cubic-bezier(0.4, 0.0, 0.2, 1)
			stroke: var(--foreground)
	:global(table)
		border-collapse: collapse
		:global(td), :global(th)
			border: 1px solid var(--border)
			padding: 6px 9px
	:global(code)
		background-color: hsla(231, 8%, 70%, 0.2)
		border-radius: 6px
		padding: .2em .3em
		font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace
		font-size: 95%
	:global(code, p)
		line-height: 1.5
	:global(li)
		margin-top: .25em
</style>
