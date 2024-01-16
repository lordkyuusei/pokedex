import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit(), SvelteKitPWA({
		strategies: "generateSW",
		srcDir: "src",
		mode: "production",
		manifest: {
			"theme_color": "#ae9cc9",
			"background_color": "#352b46",
			"orientation": "any",
			"display": "standalone",
			"lang": "fr-FR",
			"name": "The Dex",
			"short_name": "the-dex-vite",
			"start_url": "./",
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
			],
			"screenshots": [
				{
					"src": "./screenshots/dex-stats.jpeg",
					"type": "image/jpeg",
					"sizes": "2788x1809",
					"form_factor": "wide"
				},
				{
					"src": "./screenshots/dex-moves.jpeg",
					"type": "image/jpeg",
					"sizes": "2788x1809",
					"form_factor": "wide"
				},
				{
					"src": "./screenshots/dex-sprites.jpeg",
					"type": "image/jpeg",
					"sizes": "2788x1809",
					"form_factor": "wide"
				},
				{
					"src": "./screenshots/dex-stats-mobile.jpg",
					"type": "image/jpeg",
					"sizes": "780x1689",
					"form_factor": "narrow"
				}
			],
			"protocol_handlers": [
				{
					"protocol": "web+dex",
					"url": "/pokemon/%s/stats"
				}
			]
		}
		// devOptions: {
		// 	enabled: true,
		// 	suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
		// 	type: 'module',
		// 	navigateFallback: '/',
		// },
	})],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
