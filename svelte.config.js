import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-static'
import { mdsvex } from 'mdsvex'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [
    preprocess(),
    mdsvex({
      extensions: ['.md'],
    }),
  ],

  kit: {
    adapter: adapter({
      fallback: null,
    }),
    prerender: {
      default: true,
    },
  },
}

export default config
