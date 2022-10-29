<script context="module">
	export const prerendering = true;
</script>

<script lang="ts">
	import { getContext, onMount } from 'svelte';
	const { setTheme } = getContext('theme');
	let isChecked: boolean;

	onMount(() => {
		isChecked = localStorage.getItem('currentTheme') !== 'moon';
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
		border-radius: 1.5em;
		background-color: #1a1423;
	}

	.theme-switch {
		position: absolute;
		opacity: 0;
		top: 0;
		left: 0;
		width: 100%;
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
		background-color: #2b2536;
		border-radius: 1em;
		transition: all 0.2s ease-out;
		z-index: 2;
		cursor: pointer;
	}

	.theme-visual > .theme-toggle:hover {
		transform: scale(0.9);
	}

	.theme-visual > .theme-toggle.toggle-check {
		transform: translateX(2em);
		transition: all 0.2s ease-out;
	}

	.theme-visual > .theme-image {
		position: absolute;
		top: 1px;
		right: 2px;
		height: calc(2em - 4px);
		width: calc(2em - 4px);
		background: url('/sun.png') no-repeat center/90%;
		transition: all 0.2s ease-out;
	}

	.theme-visual > .theme-image.image-check {
		background: url('/moon.png') no-repeat center/90%;
		transform: translateX(-2em);
		transition: all 0.2s ease-out;
	}
</style>
