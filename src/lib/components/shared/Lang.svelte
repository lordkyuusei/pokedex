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

<button id="pokedex-lang-toggle" on:click={() => (showLangs = !showLangs)}>㊙️</button>

<section id="pokedex-lang-list" class:shown={showLangs}>
	<section class="languages">
		{#each locales as availableLocale}
			{#if availableLocale !== $locale}
				<button on:click={() => updateLocale(availableLocale)}>{availableLocale}</button>
			{/if}
		{/each}
	</section>
</section>

<style>
	#pokedex-lang-toggle {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--theme-alt-background);
		border: 2px solid var(--theme-background);
		border-radius: var(--theme-border-r);
		padding: 0.35em;
		position: relative;
	}

	#pokedex-lang-toggle:hover {
		cursor: pointer;
		background-color: var(--theme-background);
	}

	#pokedex-lang-list {
		position: relative;
	}

	#pokedex-lang-list > .languages {
		display: none;
		position: absolute;
		top: -3.5rem;
		left: -4.5rem;
		min-width: 5.5rem;
		background-color: var(--theme-background);
		border: 2px solid var(--theme-alt-background);
		border-radius: var(--theme-border-r);
	}

	#pokedex-lang-list > .languages > button {
		color: var(--theme-text);
		background-color: transparent;
		border: none;
		cursor: pointer;
	}

	#pokedex-lang-list.shown > .languages {
		display: flex;
		justify-content: center;
	}

	@media (min-width: 320px) and (max-width: 1024px) {
		#pokedex-lang-list > .languages {
			top: 2em;
		}
	}
</style>
