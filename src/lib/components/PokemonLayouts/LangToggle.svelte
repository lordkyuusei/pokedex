<script lang="ts">
	import { onMount } from 'svelte';

	import { browser } from '$app/environment';
	import { locale, locales } from '$lib/store/i18n/i18n';

	const updateLocale = (newLocale: string) => {
		$locale = newLocale;
		localStorage.setItem('locale', newLocale);
	};

	let showLangs: boolean = false;

	onMount(() => {
		if (browser) {
			updateLocale(localStorage.getItem('locale') || 'english');
		}
	});
</script>

<span id="pokedex-lang-toggle" on:click={() => (showLangs = !showLangs)}>
	㊙️
	<section class="languages" class:shown={showLangs}>
		{#each locales as availableLocale}
			{#if availableLocale !== $locale}
				<button on:click={() => updateLocale(availableLocale)}>{availableLocale}</button>
			{/if}
		{/each}
	</section>
</span>

<style>
	#pokedex-lang-toggle {
		height: calc(2em - 4px);
		width: calc(2em - 4px);
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--theme-alt-background);
		border: 2px solid var(--theme-background);
		border-radius: 2em;
		position: relative;
	}

	#pokedex-lang-toggle:hover {
		cursor: pointer;
		background-color: var(--theme-background);
	}

	#pokedex-lang-toggle > .languages {
		display: none;
		position: absolute;
		top: -4em;
		left: -2em;
		width: calc(6em);
		height: 100%;
		background-color: var(--theme-background);
		border: 2px solid var(--theme-alt-background);
		border-radius: 1em;
	}

	#pokedex-lang-toggle > .languages > button {
		color: var(--theme-text);
		background-color: transparent;
		border: none;
		cursor: pointer;
	}

	#pokedex-lang-toggle > .languages.shown {
		display: flex;
		justify-content: center;
	}

	@media (min-width: 320px) and (max-width: 1024px) {
		#pokedex-lang-toggle > .languages {
			top: 3em;
		}
	}
</style>
