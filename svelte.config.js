import adapter from '@sveltejs/adapter-static'
import { mdsvex } from 'mdsvex'
import { sveltePreprocess } from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
export default {
	extensions: ['.svelte', '.md'],
	preprocess: [
		sveltePreprocess(),
		mdsvex({
			extensions: ['.md'],
			smartypants: false,
		}),
	],

	kit: {
		adapter: adapter({
			fallback: null,
		}),
	},
}
