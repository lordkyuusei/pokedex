import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vitest/config';
import webmanifest from './manifest.json';

export default defineConfig({
	plugins: [sveltekit(), SvelteKitPWA({
		strategies: "generateSW",
		srcDir: "src",
		mode: "production",
		manifest: webmanifest,
		devOptions: {
			enabled: true,
			suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
			type: 'module',
			navigateFallback: '/',
		},
	})],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
