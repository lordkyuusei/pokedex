<script lang="ts">
	import { onMount } from 'svelte';
	import { theme } from '$lib/store/theme';

	const prefersDark = '(prefers-color-scheme: dark)';
	const prefersLight = '(prefers-color-scheme: light)';

	$: isChecked = $theme === 'moon';

	const setTheme = () => ($theme = $theme === 'moon' ? 'sun' : 'moon');

	onMount(() => {
		const mapColorSchemeToTheme: Array<{ match: boolean; theme: Theme }> = [
			{ match: window.matchMedia(prefersDark).matches, theme: 'moon' },
			{ match: window.matchMedia(prefersLight).matches, theme: 'sun' }
		];

		const match = mapColorSchemeToTheme.find((x) => x.match === true);
		if (match) {
			$theme = match.theme;
		}
	});
</script>

<label for="pokedex-theme-toggle" class="pokedex-theme">
	<input
		id="pokedex-theme-toggle"
		title="Toggle dark / light mode"
		aria-label="Toggle dark / light mode"
		type="checkbox"
		class="theme-switch"
		bind:checked={isChecked}
		on:click={setTheme}
	/>
	<section class="theme-visual">
		<span class="theme-toggle" class:toggle-check={isChecked} />
		<span class="theme-image" class:image-check={isChecked} />
	</section>
</label>

<style>
	.pokedex-theme {
		position: relative;
		display: block;
		height: 2em;
		width: 4em;
		border-radius: var(--border-r-50);
		background-color: var(--background-alt-color);
	}
	.theme-switch {
		position: absolute;
		opacity: 0;
		top: 0;
		left: 0;
		width: calc(100% - 0.5em);
	}
	.theme-visual {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.theme-visual > .theme-toggle {
		position: absolute;
		top: 2px;
		left: 2px;
		height: calc(2em - 4px);
		width: calc(2em - 4px);
		background-color: var(--background-color);
		border-radius: var(--border-r-50);
		transition: all var(--transition-duration) var(--transition);
		z-index: 2;
		cursor: pointer;
	}
	.theme-visual > .theme-toggle:hover {
		transform: scale(0.9);
	}
	.theme-visual > .theme-toggle.toggle-check {
		transform: translateX(2em);
		transition: all var(--transition-duration) var(--transition);
	}
	.theme-visual > .theme-image {
		position: absolute;
		top: 1px;
		right: 2px;
		height: calc(2em - 4px);
		width: calc(2em - 4px);
		background: url('/sun.png') no-repeat center/90%;
		transition: all var(--transition-duration) var(--transition);
	}
	.theme-visual > .theme-image.image-check {
		background: url('/moon.png') no-repeat center/90%;
		transform: translateX(-2em);
		transition: all var(--transition-duration) var(--transition);
	}
</style>
