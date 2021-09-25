<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import type { Writable } from 'svelte/store'

  const theme: Writable<string | null> = writable(null)
  $: if ($theme) {
    document.documentElement.setAttribute('data-theme', $theme)
  }
  onMount(() => {
    $theme = document.documentElement.getAttribute('data-theme') || 'dark'
    const prefersDark = matchMedia('(prefers-color-scheme: dark)')
    prefersDark.onchange = (e) => {
      $theme = e.matches ? 'dark' : 'light'
      localStorage.removeItem('theme')
    }
  })
  function toggleTheme() {
    if ($theme === 'dark') {
      $theme = 'light'
    } else {
      $theme = 'dark'
    }
    localStorage.setItem('theme', $theme || 'dark')
  }
</script>

<div class="layout">
  <header>
    <h2><a href="/">Svelte Date Picker</a></h2>
    <a class="nav-link" href="/demo">Demo</a>
    <a class="nav-link" href="/docs">Docs</a>
    <div class="spacer" />
    <a class="nav-link" href="https://github.com/probablykasper/svelte-date-picker">GitHub</a>
    <button class="theme-toggle" on:click={toggleTheme}>
      {#if theme}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          enable-background="new 0 0 24 24"
          viewBox="0 0 24 24"
          height="22px"
          width="22px"
          ><rect fill="none" height="24" width="24" /><path
            d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z" /></svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          enable-background="new 0 0 24 24"
          viewBox="0 0 24 24"
          height="22px"
          width="22px"
          ><rect fill="none" height="24" width="24" /><path
            d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z" /></svg>
      {/if}
    </button>
  </header>
  <div class="page">
    <slot />
  </div>
</div>

<style lang="sass">
  @import url('./_prism-holi-theme.css')
  :global(html)
    --primary: #0269f7
    --input-highlight-border: rgb(2, 105, 247)
    --input-highlight-shadow: rgba(2, 105, 247, 0.5)
    --input-width: 150px
    --date-input-width: var(--input-width)
    color: var(--foreground)
  :global([data-theme='dark'])
    --background: #0d0e12
    --foreground: #f7f7f7
    --border: #1C1E24
    --input-background: #1b1e27
    --date-picker-background: #1b1e27
    --date-picker-foreground: var(--foreground)
    --date-picker-highlight-border: var(--input-highlight-border)
    --date-picker-highlight-shadow: var(--input-highlight-shadow)
  :global([data-theme='light'])
    --background: #ffffff
    --foreground: #0d0e12
    --border: #c6cddd
    --input-background: #ffffff

  :global(html)
    min-height: 100%
  :global(body)
    font-family: Inter, sans-serif
    margin: 0px
  :global(a)
    color: #074ced
    text-decoration: none
  .layout
    background-color: var(--background)
    transition: all 80ms ease-in-out
    min-height: 100vh
  header
    display: flex
    align-items: center
    height: 60px
    max-width: 800px
    padding: 0px 30px
    padding-top: 10px
    margin: auto
  .page
    max-width: 800px
    margin: auto
    padding: 0px 30px
    padding-bottom: 100px
  h2
    color: var(--primary)
    margin-right: 20px
  a
    color: inherit
  a, button.theme-toggle
    -webkit-tap-highlight-color: transparent
    -moz-tap-highlight-color: rgba(0, 0, 0, 0)
    &:hover
      opacity: 0.7
  a.nav-link
    padding: 5px 2px
    margin: 0px 8px
    transition: all 80ms ease-in-out
  .spacer
    margin: auto
  button.theme-toggle
    display: block
    border: none
    background-color: transparent
    padding: 5px 2px
    margin: 5px
    cursor: pointer
    svg
      fill: var(--foreground)
      display: block
      transition: all 80ms ease-in-out
  :global(table)
    border-collapse: collapse
    :global(td), :global(th)
      border: 1px solid var(--border)
      padding: 6px 9px
</style>
