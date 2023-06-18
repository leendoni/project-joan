// import preprocess from 'svelte-preprocess';
// import adapter from '@sveltejs/adapter-auto';

// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	kit: {
// 		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
// 		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
// 		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
// 		adapter: adapter()
// 	},

// 	preprocess: [
// 		preprocess({
// 			postcss: true
// 		})
// 	]
// };

import adapter from "@sveltejs/adapter-auto";

import { optimizeImports, optimizeCss, elements, icons } from "carbon-preprocess-svelte";

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: [optimizeImports(), elements(), icons()],
  kit: {
    adapter: adapter(),
    // vite: {
    //   plugins: [process.env.NODE_ENV === "production" && optimizeCss()],
    // },
  },
};