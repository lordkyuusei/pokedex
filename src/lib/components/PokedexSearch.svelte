<script lang="ts">
	import { browser } from '$app/env';

	import { goto } from '$app/navigation';

	import { fetchPokemonSpriteURL } from '$lib/api';
	import PokemonType from './PokemonType.svelte';

	type light = {
		id: number;
		name: string;
		types: string[];
	};

	let searchText: string = '';
	let searchResults: light[] = [];
	let searchCodex: light[] = [];

	const fetchLightkedex = async () =>
		(searchCodex = await (await fetch('/lightkedex.json')).json());

	const search = async (event: KeyboardEvent): Promise<void> => {
		if (event.key === 'Enter') {
			if (searchText.match(/^\d+$/)) {
				goto(`/pokemon/${searchText}`);
			} else {
				const results = searchCodex.filter((item: light) =>
					item.name.toLowerCase().includes(searchText.toLowerCase())
				);
				if (results.length === 1) {
					goto(`/pokemon/${results[0].id}`);
				} else {
					searchResults = results;
				}
			}
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
	type="text"
	title="Search for Pokémon by name or ID"
	placeholder="Search for Pokémon by name or ID"
	autocomplete="off"
	name="search"
	bind:value={searchText}
	on:focus|once={fetchLightkedex}
	on:keyup={(event) => search(event)}
	use:useDismiss
	on:dismiss={onDismiss}
/>
{#if searchResults.length}
	<div class="pokemon-list" on:click|self={() => (searchResults = [])}>
		{#each searchResults as pokemon}
			<a href="/pokemon/{pokemon.id}" on:click={() => (searchResults = [])}>
				<div class="pokemon-result-row">
					<img
						src={fetchPokemonSpriteURL(`${pokemon.id}`, 'versions', 'generation-viii', 'icons')}
						alt={pokemon.name}
					/>
					<span>{pokemon.name}</span>
					{#each pokemon.types as type}
						<PokemonType name={type} />
					{/each}
				</div>
			</a>
		{/each}
	</div>
{/if}

<style>
	input {
		border-width: 0 0 2px 0;
		border-style: solid;
		border-color: var(--theme-text);
		background-color: var(--theme-background);
		color: var(--theme-secondary);
		width: 60vw;
		max-width: 500px;
		height: 100%;
		font: inherit;
	}

	input:focus {
		outline: none;
	}

	a {
		width: 100%;
	}

	img {
		padding-bottom: 1rem;
	}

	.pokemon-list {
		z-index: 2;
		display: flex;
		flex-wrap: wrap;
		position: absolute;
		align-items: center;
		justify-content: center;
		width: 60vw;
		max-width: 500px;
		max-height: 50%;
		overflow-y: scroll;
		border-style: solid;
		border-width: 0 2px 2px;
		color: var(--theme-text);
		border-radius: 0 0 10px 10px;
		background-color: var(--theme-background);
	}

	.pokemon-result-row {
		width: 100%;
		display: grid;
		grid-template-columns: 12% 20% 34% 34%;
		align-content: center;
		justify-content: center;
		align-items: center;
		justify-items: stretch;
		transition: 0.2s;
	}

	.pokemon-result-row:hover {
		background-color: var(--theme-text);
		color: var(--theme-background);
		border-color: var(--theme-text);
	}

	@media screen and (max-width: 720px) {
		.pokemon-list {
			width: calc(100% - 2rem);
			left: 1rem;
		}
	}
</style>
