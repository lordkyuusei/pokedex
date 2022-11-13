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
					src={fetchPokemonSpriteURL(`${pokemon.id}`, 'versions', 'generation-viii', 'icons')}
					height="100%"
					width="100%"
					alt={pokemon.name}
				/>
				<span>{pokemon.name}</span>
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
		border-radius: 1rem;
		color: var(--theme-secondary);
		border: 1px solid var(--theme-text);
		background-color: var(--theme-background);
	}

	input:focus {
		outline: 1px solid transparent;
	}

	.pokemon-list {
		position: absolute;
		left: calc(1em - 1px);
		top: calc(2rem - 1px);
		width: calc(100% - 2em);
		z-index: 3;
		max-height: 50vh;
		overflow-y: auto;
		border: 1px solid var(--theme-text);
		border-top: 1px solid var(--theme-alt-background);
		color: var(--theme-text);
		border-radius: 0 0 10px 10px;
		background-color: var(--theme-background);
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
		grid-template-rows: 1fr;
		place-content: center;
		align-items: center;
		gap: 1em;
		transition: all 0.2s;
	}

	.pokemon-list > .pokemon-result-row > img {
		transform: translateY(-0.75rem);
		inline-size: 75%;
	}

	@media (max-width: 1024px) {
		.pokemon-list {
			left: 0;
			top: 4em;
			width: 100vw;
			border-inline: none;
			border-radius: 0;
		}
	}
</style>
