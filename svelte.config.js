import adapter from '@sveltejs/adapter-static'
import { mdsvex } from 'mdsvex'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
export default {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
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
