<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	import type { LightCodex } from '$lib/types/Lightcodex';

	import { t, locale } from '$lib/store/i18n/i18n';
	import PokemonType from './PokemonType.svelte';
	import { fetchItemSpriteURL, fetchPokemonSpriteURL } from '$lib/api';

	let searchText: string = '';
	let searchResults: LightCodex[] = [];
	let searchCodex: LightCodex[] = [];

	$: title = $t('search.placeholder');

	const fetchLightkedex = async () => {
		searchCodex = await fetch('/lightkedex.json').then((res) => res.json());
	};

	const searchNames = (item: LightCodex, searchText) => {
		const { name, names } = item;
		return (
			name.toLocaleLowerCase().includes(searchText) ||
			names['fr'].toLocaleLowerCase().includes(searchText) ||
			names['en'].toLocaleLowerCase().includes(searchText)
		);
	};

	const search = async (event: KeyboardEvent): Promise<void> => {
		const results = searchCodex
			.filter((item: LightCodex) => searchNames(item, searchText.toLocaleLowerCase()))
			.slice(0, 20);

		searchResults = results;

		if (event.key === 'Enter') {
			const dest = searchText.match(/^\d+$/) ? searchText : results[0].id;
			goto(`/pokemon/${dest}`);
			onDismiss();
		}
		if (!searchText.length) {
			searchResults = [];
		}
	};

	const onDismiss = () => {
		searchText = '';
		searchResults = [];
	};

	const useDismiss = (node) => {
		const handleDismiss = (event) => {
			if (node && !node.contains(event.target) && !event.defaultPrevented) {
				node.dispatchEvent(new CustomEvent('dismiss', node));
			}
		};

		if (browser) {
			document.addEventListener('click', handleDismiss, true);
		}

		return {
			destroy() {
				if (browser) {
					document.removeEventListener('click', handleDismiss, true);
				}
			}
		};
	};
</script>

<input
	type="search"
	{title}
	placeholder={title}
	autocomplete="off"
	name="search"
	bind:value={searchText}
	on:focus|once={fetchLightkedex}
	on:keyup={(event) => search(event)}
	on:click|self={() => (searchResults = [])}
	use:useDismiss
	on:dismiss={onDismiss}
/>
{#if searchResults.length}
	<section class="pokemon-list">
		{#each searchResults as pokemon (pokemon.id)}
			<a
				class="pokemon-result-row"
				href="/pokemon/{pokemon.id}"
				on:click={() => (searchResults = [])}
			>
				<img
					src={fetchPokemonSpriteURL(`${pokemon.id}`, 'icons', 'generation-viii', '')}
					on:error={(e) => (e.target.src = fetchPokemonSpriteURL('0'))}
					alt={pokemon.names[$locale.substring(0, 2)]}
				/>
				<span>{pokemon.names[$locale.substring(0, 2)]}</span>
				{#each pokemon.types as type}
					<PokemonType name={type} />
				{/each}
			</a>
		{/each}
	</section>
{/if}

<style>
	input {
		width: 100%;
		height: 2rem;
		padding-inline-start: 1em;
		border-radius: var(--theme-border-r);
		color: var(--theme-secondary);
		border: 1px solid var(--theme-text);
		background-color: var(--theme-background);
	}

	input:focus {
		outline: 1px solid transparent;
	}

	.pokemon-list {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		position: absolute;
		left: calc(1em - 1px);
		top: calc(2rem - 1px);
		width: calc(100% - 2em);
		max-height: 50vh;
		overflow-y: auto;
		border: 1px solid var(--theme-text);
		border-top: 1px solid var(--theme-alt-background);
		color: var(--theme-text);
		border-radius: 0 0 var(--theme-border-r) var(--theme-border-r);
		background-color: var(--theme-background);
		z-index: 3;
	}

	.pokemon-list > .pokemon-result-row:hover {
		background-color: var(--theme-text);
		color: var(--theme-background);
		border-color: var(--theme-text);
	}

	.pokemon-list > .pokemon-result-row {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr minmax(100px, 1fr) 2fr 2fr;
		grid-template-rows: 50px;
		place-content: center;
		align-items: center;
		gap: 1em;
		transition: all 0.2s;
	}

	.pokemon-list > .pokemon-result-row > img {
		transform: translateY(-1rem);
		inline-size: 75%;
	}

	@media (max-width: 768px) {
		.pokemon-list > .pokemon-result-row > img {
			transform: translateY(-0.5rem);
			inline-size: 100%;
		}
	}

	@media (max-width: 1024px) {
		.pokemon-list {
			left: 0;
			top: 3em;
			width: 100vw;
			border-inline: none;
			border-radius: 0;
		}
	}
</style>
