<script lang="ts">
	import { onMount } from 'svelte';
	import { theme } from '$lib/store/theme';
	import { browser } from '$app/environment';

	const prefersDark = '(prefers-color-scheme: dark)';
	const prefersLight = '(prefers-color-scheme: light)';

	$: isChecked = $theme === 'moon';

	const setTheme = () => {
		$theme = $theme === 'moon' ? 'sun' : 'moon';
		if (browser) {
			localStorage.setItem('themePreference', $theme);
		}
	};

	onMount(() => {
		const mapColorSchemeToTheme: Array<{ match: boolean; theme: Theme }> = [
			{ match: window.matchMedia(prefersDark).matches, theme: 'moon' },
			{ match: window.matchMedia(prefersLight).matches, theme: 'sun' }
		];

		const themePreference = mapColorSchemeToTheme.find((x) => x.match === true);
		const setThemePreference: Theme =
			(localStorage.getItem('themePreference') as Theme) ?? themePreference?.theme ?? 'moon';

		$theme = setThemePreference;
	});
</script>

<label for="pokedex-theme-toggle" class="pokedex-theme">
	<input
		type="checkbox"
		id="pokedex-theme-toggle"
		title="Toggle dark / light mode"
		aria-label="Toggle dark / light mode"
		class="theme-input"
		on:click={setTheme}
		bind:checked={isChecked}
	/>
	<span class="theme-toggle" class:toggle-check={isChecked} />
	<span class="theme-image" class:image-check={isChecked} />
</label>

<style>
	.pokedex-theme {
		height: 2rem;
		aspect-ratio: 2 / 1;
		border-radius: var(--border-r-50);
		background-color: var(--background-color-__);
		display: grid;
		grid-template: 100% / 1fr;
		padding: calc(var(--smallest-gap) / 2);

		& > .theme-input {
			grid-area: 1 / 1;
			appearance: none;
			border: 0;
		}

		& > .theme-toggle, & > .theme-image {
			grid-area: 1 / 1;
			height: 100%;
			aspect-ratio: 1;
			transition: all var(--transition-duration) var(--transition-function);
		}

		& > .theme-toggle {
			cursor: pointer;
			border-radius: var(--border-r-50);
			background-color: var(--background-color-_);

			&.toggle-check {
				transform: translateX(calc(100% + var(--smallest-gap)));
			}

			&:hover {
				scale: 0.9;
			}
		}

		& > .theme-image {
			background: url('/moon.png') no-repeat center/90%;

			&:not(.image-check) {
				background: url('/sun.png') no-repeat center/90%;
				transform: translateX(calc(100% + var(--smallest-gap)));
			}
		}
	}

	@media (max-width: 640px) {
		.pokedex-theme {
			aspect-ratio: 1;
			overflow: hidden;
		}

		.theme-toggle {
			display: none;
		}

		.theme-image {
			cursor: pointer;
		}

		.theme-image:not(.image-check) {
			transform: translateX(0) !important;
		}
	}
</style>
