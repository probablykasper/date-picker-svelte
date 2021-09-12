<header>
  <a href="/"><h2>Svelte Date Picker</h2></a>
  <nav>
    <a href="/demo">Demo</a>
    <a href="/docs">Docs</a>
  </nav>
</header>
<div class="page">
  <slot />
</div>

<style lang="sass">
  @import url('./_prism-holi-theme.css')
  :global(body)
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif
    max-width: 800px
    padding: 0px 30px
    margin: auto
    background-color: #e0fff4
    padding-bottom: 100px
  :global(a)
    color: #074ced
    text-decoration: none
  header
    display: flex
    align-items: center
    padding-top: 10px
    height: 60px
  a
    color: #000000
  nav
    margin-left: 30px
    padding-right: 50px
    display: flex
    a
      padding: 5px
      transition: all 0.1s ease-in-out
      &:hover
        color: #4775ff
  :global(table)
    border-collapse: collapse
    :global(td), :global(th)
      border: 1px solid rgba(#000000, 0.3)
      padding: 6px 9px
</style>
