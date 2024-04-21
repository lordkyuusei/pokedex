<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { lang } from '$lib/store/lang';

	import Book from '$lib/components/common/Book.svelte';
	import useDismiss from '$lib/functions/useDismiss';
	import type { Lightkemon } from '$lib/types/lightkemon';
	import { navigatePokemon } from '$lib/functions/navigate';

	const DEFAULT_SEARCH_DELAY: number = 300;
	const DEFAULT_SEARCH_MIN_LENGTH = 3;

	let show: boolean = false;
	let searchText: string;
	let searchInputRef: HTMLInputElement;
	let results: Promise<Lightkemon[]>;
	let debounceTimer: NodeJS.Timeout;

	const debounce = async (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			showPane();
		} else if (e.key === 'Enter') {
			showPane();

			results.then((pokemonList) => {
				if (!pokemonList) return;
				const url = getBookUrl(`${pokemonList[0]?.id}`);
				goto(url);
			});
		} else {
			if (debounceTimer) clearTimeout(debounceTimer);

			if (searchText.length >= DEFAULT_SEARCH_MIN_LENGTH || !Number.isNaN(parseInt(searchText))) {
				debounceTimer = setTimeout(async () => {
					const result: Response = await fetch(`/api/search?input=${searchText}`);
					results = result.json();
				}, DEFAULT_SEARCH_DELAY);
			} else {
				results = new Promise((res, rej) => res([]));
			}
		}
	};

	const showPane = () => {
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

<button id="dex-search" class="search-button" on:click={showPane}>
	<img class="search-icon" src="/dex-search.svg" alt="Search" />
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
			<img class="search-icon" src="/dex-search.svg" alt="logo" />
		</search>
	</header>
	<output id="pan-results">
		{#await results then pokemonList}
			{#if pokemonList}
				{#each pokemonList as pokemon}
					<a href={getBookUrl(`${pokemon.id}`)} on:click={showPane}>
						<Book id={pokemon.id} name={pokemon.i18n[$lang]} types={pokemon.types} landscape />
					</a>
				{:else}
					<pre>No result</pre>
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
		z-index: 2;
		background-color: var(--background-color-__);
		border-radius: var(--border-r-50) 0 0 var(--border-r-50);
		transition: all var(--transition-duration) var(--transition);

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
		background-color: var(--background-color-_);
	}

	#pan-header > #header-search .search-icon,
	.search-button > .search-icon {
		transform: scale(0.85);
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
