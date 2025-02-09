<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { lang } from '$lib/store/lang';

	import Book from '$lib/components/fragments/Book.svelte';
	import useDismiss from '$lib/functions/useDismiss';
	import { navigatePokemon } from '$lib/functions/navigate';
	import type { SearchResult } from '$lib/types/search';

	const DEFAULT_SEARCH_DELAY: number = 300;
	const DEFAULT_SEARCH_MIN_LENGTH = 3;

	let show: boolean = false;
	let searchText: string;
	let searchInputRef: HTMLInputElement;
	let results: Promise<SearchResult>;
	let debounceTimer: NodeJS.Timeout;

	const debounce = async (e: KeyboardEvent) => {
		if (e.key === 'Escape') return togglePane();

		if (e.key === 'Enter') {
			togglePane();

			results.then(({ pokemonList }) => {
				if (!pokemonList) return;
				const url = getBookUrl(`${pokemonList[0]?.id}`);
				goto(url);
			});
		} else {
			if (debounceTimer) clearTimeout(debounceTimer);

			if (searchText.length >= DEFAULT_SEARCH_MIN_LENGTH || !Number.isNaN(parseInt(searchText))) {
				debounceTimer = setTimeout(async () => {
					const result = await fetch(`/api/search?input=${searchText}`);
					results = await result.json();
				}, DEFAULT_SEARCH_DELAY);
			} else {
				results = new Promise((res, rej) => res({} as SearchResult));
			}
		}
	};

	const togglePane = () => {
		show = !show;
		searchInputRef.focus();
	};

	const hidePane = () => {
		show = false;
		searchText = '';
		searchInputRef.blur();
	};

	const getBookUrl = (id: string) => {
		const url = navigatePokemon(id, $page, 'pokemon');
		return url;
	};
</script>

<button id="dex-search" class="search-button" on:click={togglePane}>
	<svg class="search-icon">
		<use href="#icon-magnifier"></use>
	</svg>
</button>

<aside id="dex-pan" class:show use:useDismiss on:dismiss={hidePane}>
	<header id="pan-header">
		<search id="header-search">
			<input
				title="Search N°, Pokémon..."
				type="search"
				class="search-input"
				bind:this={searchInputRef}
				bind:value={searchText}
				on:keyup={debounce}
			/>
			<svg class="search-icon">
				<use href="#icon-magnifier"></use>
			</svg>
		</search>
	</header>
	<output id="pan-results">
		{#await results then searchResult}
			{#if searchResult}
				{@const { pokemonList = [], movesList = [], abilityList = [] } = searchResult}
				{#each pokemonList as pokemon}
					<a href={getBookUrl(`${pokemon.id}`)} on:click={togglePane}>
						<Book id={pokemon.id} name={pokemon.i18n[$lang]} types={pokemon.types} landscape />
					</a>
				{/each}
				{#each movesList as move}
					<a href={`/moves/${move.moveType}/${move.id}`} on:click={togglePane}>
						<span>{move?.i18n?.fr}</span>
					</a>
				{/each}
				{#each abilityList as ability}
					<a href={`/abilities/${ability.id}`} on:click={togglePane}>
						<span>{ability.i18nName.fr}</span>
					</a>
				{/each}
			{/if}
		{/await}
	</output>
</aside>

<style>
	#dex-pan {
		display: grid;
		grid-template: 'header' 10svh 'results' 90svh / 100%;

		position: fixed;
		top: 0;
		width: 40svw;
		right: -40svw;
		padding-inline: var(--small-gap);
		z-index: 5;
		background-color: var(--background-color);
		border-radius: var(--border-r-50) 0 0 var(--border-r-50);
		transition: all var(--transition-duration) var(--transition-function);

		&:not(.show) {
			box-shadow: none;
		}

		&.show {
			transform: translateX(-100%);
			box-shadow: var(--box-shadow);
		}
	}

	#pan-header {
		grid-area: header;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	#pan-header > #header-search {
		display: grid;
		justify-items: flex-end;
		width: 100%;
	}

	#pan-header > #header-search .search-input {
		grid-area: 1 / 1;
		border: none;
		width: 100%;
		padding-inline: var(--normal-gap);
		border-radius: var(--border-r-100);
		background-color: var(--background-second-color);
	}

	#pan-header > #header-search .search-icon,
	.search-button > .search-icon {
		height: 2rem;
		width: 2rem;
	}

	#pan-header > #header-search .search-icon {
		grid-area: 1 / 1;
		margin-right: 1em;
	}

	#pan-results {
		display: flex;
		flex-direction: column;
		gap: var(--small-gap);
		overflow: auto;
	}

	@media (max-width: 640px) {
		#dex-pan {
			width: 100svw;
			right: -100svw;
		}
	}
</style>
