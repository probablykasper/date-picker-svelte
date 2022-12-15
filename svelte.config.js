import adapter from '@sveltejs/adapter-static'
import { mdsvex } from 'mdsvex'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.md'],
    }),
  ],

  kit: {
    adapter: adapter({
      fallback: null,
    }),
  },
}

export default config
