import adapter from '@sveltejs/adapter-vercel';
import type { Config } from '@sveltejs/kit/vite';

export default {
	adapter: adapter(),
	// The revalidation API and locale redirects need root-relative paths.
	paths: { relative: false },
	version: { pollInterval: 0 },
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in Svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	inlineStyleThreshold: 2048,
	csp: {
		mode: 'auto',
		directives: {
			'default-src': ['self'],
			'base-uri': ['none'],
			'object-src': ['none'],
			'script-src': [
				'self',
				'https://www.google.com',
				'https://www.gstatic.com'
			],
			'script-src-attr': ['none'],
			'style-src': ['self', 'unsafe-inline'],
			'font-src': ['self'],
			'img-src': [
				'self',
				'data:',
				'https://www.artkyt.com',
				'https://*.supabase.co',
				'https://ik.imagekit.io'
			],
			'connect-src': [
				'self',
				'https://www.artkyt.com',
				'https://www.google.com',
				'https://*.supabase.co'
			],
			'frame-src': [
				'https://www.google.com',
				'https://recaptcha.google.com',
				'https://www.youtube.com',
				'https://open.spotify.com',
				'https://w.soundcloud.com',
				'https://embed.music.apple.com'
			],
			'frame-ancestors': ['self'],
			'form-action': ['self'],
			'media-src': ['none'],
			'worker-src': ['none']
		}
	}
} satisfies Config;
