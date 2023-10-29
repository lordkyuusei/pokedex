import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit(), SvelteKitPWA({
		strategies: 'injectManifest',
		srcDir: 'src',
		filename: 'service-worker.ts',
		devOptions: {
			enabled: true,
			type: "module"
		},
		manifest: {
			"theme_color": "#8936FF",
			"background_color": "#2EC6FE",
			"orientation": "any",
			"display": "standalone",
			"lang": "fr-FR",
			"name": "The Dex",
			"short_name": "the-dex",
			"description": "The ultimate Pokédex",
			"id": "dex.lkyuusei.fr",
			"icons": [
				{
					"src": "./pwa-64x64.png",
					"sizes": "64x64",
					"type": "image/png"
				},
				{
					"src": "./pwa-192x192.png",
					"sizes": "192x192",
					"type": "image/png"
				},
				{
					"src": "./pwa-512x512.png",
					"sizes": "512x512",
					"type": "image/png",
					"purpose": "any"
				},
				{
					"src": "./maskable-icon-512x512.png",
					"sizes": "512x512",
					"type": "image/png",
					"purpose": "maskable"
				}
			]
		}
	})],
	server: {
		port: 5173,
		strictPort: true,
		hmr: {
			host: "localhost",
			port: 5173,
		},
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
