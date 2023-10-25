<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { lang } from '$lib/store/lang';

	import Book from '$lib/components/common/Book.svelte';
	import useDismiss from '$lib/functions/useDismiss';
	import type { Lightkemon } from '$lib/types/lightkemon';

	let show: boolean = false;
	let searchText: string;

	let results: Lightkemon[] = [];

	const searchValue = async (e: KeyboardEvent) => {
		if (e.key === 'Escape') show = !show;
		else if (e.key === 'Enter') {
			showPane();
			goto(getBookUrl(`${results[0].id}`));
		} else {
			if (searchText.length >= 3 || Number(searchText)) {
				const result: Response = await fetch(`/api/search?input=${searchText}`);
				results = await result.json();
			} else {
				results = [];
			}
		}
	};

	const showPane = () => (show = !show);
	const hidePane = () => {
		show = false;
		searchText = '';
		results = [];
	};

	const getBookUrl = (pokemonId: string) => {
		const { id } = $page.route;
		if (id?.startsWith('/pokemon')) return id.replace('[id]', pokemonId);
		else return '/pokemon/' + pokemonId;
	};
</script>

<button id="dex-search" class="search-button" on:click={showPane}>
	<img src="/dex-search.svg" alt="Search" />
</button>

<section id="dex-pan" class:show use:useDismiss on:dismiss={hidePane}>
	<header id="pan-header">
		<div id="header-search">
			<input type="search" class="search-input" bind:value={searchText} on:keyup={searchValue} />
			<img class="search-icon" src="/dex-search.svg" alt="logo" />
		</div>
	</header>
	<section id="pan-results">
		{#each results as pokemon}
			<a href={getBookUrl(`${pokemon.id}`)} on:click={showPane}>
				<Book id={pokemon.id} name={pokemon.i18n[$lang]} types={pokemon.types} landscape />
			</a>
		{/each}
		{#if results?.length === 0}
			<pre>No result</pre>
		{/if}
	</section>
</section>

<style>
	.search-button {
		border-radius: var(--border-r-100);
		border: 1px solid var(--background-color);
		background-color: var(--text-color);
		aspect-ratio: 1 / 1;
		cursor: pointer;
	}

	.search-button img {
		inline-size: 70%;
	}

	#dex-pan {
		display: grid;
		grid-template:
			'header' 10svh
			'results' 90svh / 100%;
		position: fixed;
		top: 0;
		height: 100%;
		width: 40svw;
		right: -40svw;
		background-color: var(--background-color);
		border-radius: var(--border-r-50) 0 0 var(--border-r-50);
		padding-inline: 2em;
		z-index: 2;
	}

	#dex-pan:not(.show) {
		transition: all 0.2s ease-out;
		box-shadow: none;
	}

	#dex-pan.show {
		transform: translateX(-100%);
		transition: all 0.2s ease-out;
		box-shadow: 0 -5px 5px 5px var(--background-alt-color);
	}

	#pan-header {
		display: grid;
		align-items: center;
		justify-content: center;
		gap: var(--small-gap);
	}

	#pan-header > #header-search {
		display: grid;
		grid-template: 1fr / 1fr;
		place-items: flex-end;
		grid-area: search-input;
	}

	#pan-header > #header-search .search-input {
		grid-column: 1;
		grid-row: 1;
		font-size: 2em;
		border-radius: var(--border-r-100);
		border: none;
		background-color: var(--text-color);
		color: var(--background-color);
		padding: 0 1.5em 0 1em;
		width: 100%;
	}

	#pan-header > #header-search .search-icon {
		grid-column: 1;
		grid-row: 1;
		margin-right: 1em;
		transform: scale(0.85);
	}

	#pan-header > .search-filters {
		grid-area: filters;
		margin: auto;
	}

	#pan-header > .search-close {
		grid-area: close;
		margin: auto;
	}

	#pan-results {
		display: flex;
		flex-direction: column;
		gap: var(--small-gap);
		overflow: auto;
	}

	@media (max-width: 420px) {
		#dex-pan {
			width: 100svw;
			right: -100%;
		}
	}
</style>
