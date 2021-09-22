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
  @media(min-width: 701px)
    section
      padding: 0px 20px
      border-radius: 5px
      background-color: rgba(#ffffff, 0.5)
      box-shadow: 0px 1px 3px 0px rgba(#000000, 0.05)
    section.left
      margin-right: 15px
      min-width: 240px
    .spacer
      margin-top: 20px
  @media(max-width: 700px)
    .row
      flex-direction: column
      padding: 20px
      border-radius: 5px
      background-color: rgba(#ffffff, 0.5)
      box-shadow: 0px 1px 3px 0px rgba(#000000, 0.05)
</style>
