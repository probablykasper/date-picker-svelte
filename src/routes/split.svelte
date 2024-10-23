<div class="row">
	<section class="left">
		<div class="spacer"></div>
		<slot name="left" />
		<div class="spacer"></div>
	</section>
	<section class="right">
		<div class="spacer"></div>
		<slot name="right" />
		<div class="spacer"></div>
	</section>
</div>

<style lang="sass">
	.row
		display: flex
		border: 1px solid hsla(222, 15%, 50%, 0.1)
		background: var(--card-background)
		transition: background 80ms cubic-bezier(0.4, 0.0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0.0, 0.2, 1)
		box-shadow: 0px 1px 3px 0px rgba(#000000, 0.05)
		border-radius: 5px
		padding: 10px
		flex-direction: column
		box-shadow: 0px 1px 3px 0px rgba(#000000, 0.05)
		@media (min-width: 401px)
			padding: 20px
		@media (min-width: 701px)
			flex-direction: row
		@media(max-width: 700px)
	@media(min-width: 701px)
		section.left
			padding-right: 0px
			flex-shrink: 0
			min-width: 260px
			padding-right: 10px
		.spacer
			margin-top: 20px
</style>
