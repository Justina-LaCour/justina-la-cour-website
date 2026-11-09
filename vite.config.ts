import { fileURLToPath } from 'node:url';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import kitConfig from './kit.config.ts';

export default defineConfig({
	resolve: {
		alias: { $lib: fileURLToPath(new URL('./src/lib', import.meta.url)) }
	},
	plugins: [enhancedImages(), tailwindcss(), sveltekit(kitConfig)]
});
