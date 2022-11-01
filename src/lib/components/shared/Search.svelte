<script lang="ts">
	import { browser } from '$app/environment';

	import { goto } from '$app/navigation';

	import { fetchPokemonSpriteURL } from '$lib/api';
	import { t } from '$lib/store/i18n/i18n';
	import PokemonType from './PokemonType.svelte';

	type light = {
		id: number;
		name: string;
		types: string[];
	};

	let searchText: string = '';
	let searchResults: light[] = [];
	let searchCodex: light[] = [];

	$: title = $t('search.placeholder');

	const fetchLightkedex = async () =>
		(searchCodex = (await import('../../assets/lightkedex.json')).default);

	const search = async (event: KeyboardEvent): Promise<void> => {
		const results = searchCodex
			.filter((item: light) => item.name.toLowerCase().includes(searchText.toLowerCase()))
			.slice(0, 20)
			.map((res) => ({ ...res, name: res.name.replace(searchText, `[${searchText}]`) }));

		searchResults = results;

		if (event.key === 'Enter') {
			if (searchText.match(/^\d+$/)) {
				goto(`/pokemon/${searchText}`);
				onDismiss();
			}
			if (results.length === 1) {
				goto(`/pokemon/${results[0].id}`);
				onDismiss();
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
	type="search"
	{title}
	placeholder={title}
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
		{#each searchResults as pokemon (pokemon.id)}
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
		width: 100%;
		height: 2rem;
		padding: 0 10px;
		font: inherit;
		border-radius: 1rem;
		color: var(--theme-secondary);
		border: 1px solid var(--theme-text);
		background-color: var(--theme-background);
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
		max-height: 50vh;
		position: absolute;
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
		grid-template-columns: 1fr 2fr 2.2fr 2.2fr;
		place-content: center;
		align-items: center;
		justify-items: stretch;
		gap: 1em;
		transition: all 0.2s;
	}

	.pokemon-result-row:hover {
		background-color: var(--theme-text);
		color: var(--theme-background);
		border-color: var(--theme-text);
	}
</style>
