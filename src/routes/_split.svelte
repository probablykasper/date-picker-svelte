<div class="row">
  <section class="left">
    <div class="spacer" />
    <slot name="left" />
    <div class="spacer" />
  </section>
  <section class="right">
    <div class="spacer" />
    <slot name="right" />
    <div class="spacer" />
  </section>
</div>

<style lang="sass">
  .row
    display: flex
    border: 1px solid hsla(222, 15%, 50%, 0.1)
    box-shadow: 0px 1px 3px 0px rgba(#000000, 0.05)
    border-radius: 5px
    padding: 0px 20px
  @media(min-width: 701px)
    section.left
      padding-right: 0px
      flex-shrink: 0
      min-width: 240px
      padding-right: 20px
    .spacer
      margin-top: 20px
  @media(max-width: 700px)
    .row
      flex-direction: column
      padding: 20px
      box-shadow: 0px 1px 3px 0px rgba(#000000, 0.05)
</style>
