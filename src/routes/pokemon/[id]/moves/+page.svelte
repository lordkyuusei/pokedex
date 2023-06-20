<svelte:options immutable />

<script lang="ts">
	import { fade } from 'svelte/transition';

	import { lang } from '$lib/store/lang';
	import { version } from '$lib/store/generation';
	import { extractMoves, filterMoves, searchMoves } from '$lib/functions/extractMoves';

	import type { SearchOption, SortOption } from '$lib/types/moves';
	import type { PageData } from './$types';

	export let data: PageData;

	let selectMove: string = '';
	let searchText: string = '';
	let searchOption: SearchOption = 'level-up';
	let sortOption: SortOption = { option: 'level', direction: 'asc' };

	$: console.log(searchOption);
	$: fullMoveset = extractMoves(data.pokemon.moves, $version);
	$: movesetHead = fullMoveset.then((moveset) =>
		Object.keys(moveset[0] ?? []).filter((x) => !['id', 'description', 'method'].includes(x))
	);
	$: searchOptions = fullMoveset.then((moveset) => [...new Set(moveset.map((m) => m.method.name))]);
	$: filteredMoveset = fullMoveset.then((moveset) => filterMoves(moveset, searchOption));
	$: moveset = filteredMoveset.then((moves) => searchMoves(moves, searchText, sortOption, $lang));

	const updateSort = (category: string) => {
		sortOption =
			sortOption.option === category
				? { ...sortOption, direction: sortOption.direction === 'asc' ? 'desc' : 'asc' }
				: { option: category, direction: 'asc' };
	};

	const mapPropToTag = {
		level: (move) => (move === 0 ? 'Départ' : move),
		name: (move) => move[$lang],
		type: (move) =>
			`<img src="/icons/${move.name}.png" alt="${move.name}" title="${move.name}"></img>`,
		accuracy: (move: string | undefined) => move ?? '---',
		power: (move: string | undefined) => move ?? '---',
		pp: (move: string) => move,
		category: (move: string) => move,
		damageClass: (move: string) =>
			`<img src="/icons/${move}.png" alt="${move}" title="${move}"></img>`
	};

	const mapPropToOutput = {
		level: (move) => (move === 0 ? 'Départ' : move),
		name: (move) => move[$lang],
		type: (move) => move.name,
		accuracy: (move) => move ?? '---',
		power: (move) => move ?? '---',
		pp: (move) => move,
		category: (move) => move,
		damageClass: (move) => move
	};
</script>

<section in:fade id="data-moves">
	<section id="moves">
		<header id="moves-options">
			<div id="options-search-group">
				<input id="options-search" bind:value={searchText} />
				<img class="search-icon" src="/dex-search.svg" alt="logo" />
			</div>
			<select id="options-select" bind:value={searchOption}>
				{#await searchOptions then options}
					{#each options as option}
						<option value={option}>{option}</option>
					{/each}
				{/await}
			</select>
		</header>
		<footer id="moves-table">
			<table id="table">
				<thead id="table-head">
					{#await movesetHead then categories}
						<tr>
							{#each categories as category}
								<th id="head-{category}" on:click={() => updateSort(category)}>{category}</th>
							{/each}
						</tr>
					{/await}
				</thead>
				<tbody id="table-body">
					{#await moveset}
						{#each [0, 1, 2, 3, 4, 5, 6, 7, 8] as _}
							<tr class="loading"><td colspan="12" /></tr>
						{/each}
					{:then moves}
						{#if moves.length === 0}
							<tr><td>Pas d'attaques pour {$version}</td></tr>
						{/if}
						{#each moves as move (move.id)}
							<tr on:click={() => (selectMove = move.id)}>
								{#await movesetHead then categories}
									{#each categories as category}
										<td id="move-{move?.id}-{category}">
											{@html mapPropToTag[category](move[category])}
										</td>
									{/each}
								{/await}
							</tr>
							{#if selectMove === move.id}
								<tr>
									<td id="move-{move?.id}-description" colspan="5">
										{move.description[$lang]}
									</td>
									<td id="move-{move?.id}-action" colspan="3">
										<a href="/moves/{move.type.name}/{move.id}">
											<button> ❓❓❓ </button>
										</a>
									</td>
								</tr>
							{/if}
						{/each}
					{/await}
				</tbody>
			</table>
		</footer>
	</section>
</section>

<style>
	#data-moves {
		padding: 2em;
		height: 100%;
		overflow-y: auto;
	}

	#data-moves > #moves {
		display: grid;
		grid-template:
			'moves-options' 1fr
			'moves-table' 10fr / 100%;

		height: 100%;
		width: 100%;
		border-radius: var(--border-r-200);
		overflow-y: auto;
		background-color: var(--background-color);
		box-shadow: 0 0 10px 5px var(--background-secondary);
	}

	#data-moves > #moves > #moves-options {
		display: flex;
		gap: var(--normal-gap);
		padding: 0.5em 1em;
		border-bottom: 1px solid var(--background-accent);
	}

	#data-moves > #moves > #moves-options > #options-search-group {
		display: grid;
		grid-template: 1fr / 1fr;
		align-items: center;
		justify-items: flex-end;
	}

	#data-moves > #moves > #moves-options > #options-search-group #options-search {
		grid-column: 1;
		grid-row: 1;
		font-size: 2em;
		border-radius: var(--border-r-100);
		border: none;
		background-color: var(--text-color);
		color: var(--background-color);
		padding: 0 1.5em 0 1em;
		height: 100%;
	}

	#data-moves > #moves > #moves-options > #options-search-group .search-icon {
		grid-column: 1;
		grid-row: 1;
		margin-right: 1em;
	}

	#data-moves > #moves > #moves-options > #options-select {
		cursor: pointer;
		padding: 1em 1.5em;
		border: none;
		text-transform: uppercase;
		text-align: center;
		border-radius: var(--border-r-100);
		border: none;
	}

	#data-moves > #moves > #moves-options > #options-select:focus {
		outline: none;
	}

	#data-moves > #moves > #moves-options > #options-select,
	#data-moves > #moves > #moves-options > #options-select option {
		background: var(--text-color);
		color: var(--background-color);
	}

	#data-moves > #moves > #moves-table {
		width: 100%;
		overflow-y: auto;
	}

	#data-moves > #moves > #moves-table > #table {
		width: 100%;
		overflow-y: auto;
		border-collapse: collapse;
		table-layout: fixed;
		transition: all 0.2s ease-in-out;
	}

	#data-moves > #moves > #moves-table > #table > #table-head th {
		cursor: pointer;
		color: var(--primary-color);
		border: none;
		border-bottom: 1px solid var(--background-accent);
		background-color: var(--background-alt-color);
		padding: 0.5em;
		font-weight: bolder;
		text-transform: capitalize;
		transition: all 0.2s ease-in-out;
		width: 100%;
	}

	#data-moves > #moves > #moves-table > #table > #table-head th:hover {
		border-color: var(--primary-color);
	}

	#data-moves > #moves > #moves-table > #table > #table-body .loading {
		height: 4em;
		animation: loading 1s ease-in-out infinite alternate;
	}

	#data-moves > #moves > #moves-table > #table > #table-body tr:nth-child(2n) {
		background-color: var(--background-color);
	}

	#data-moves > #moves > #moves-table > #table > #table-body tr:nth-child(2n + 1) {
		background-color: var(--background-accent);
	}

	#data-moves > #moves > #moves-table > #table td[id^='move-'] {
		text-align: center;
		padding: 1em;
	}

	#data-moves > #moves > #moves-table > #table tr:has(td[id^='move-']:not([id$='-description'])) {
		cursor: pointer;
	}

	#data-moves > #moves > #moves-table > #table tr:has(td[id$='-description']) {
		border: 1px solid var(--primary-color);
	}

	#data-moves
		> #moves
		> #moves-table
		> #table
		tr:has(td[id^='move-']:not([id$='-description'])):hover
		> td {
		background-color: var(--background-alt-color);
		transition: all 0.05s ease-in-out;
	}

	@keyframes loading {
		0% {
			filter: contrast(1);
		}

		100% {
			filter: contrast(1.5);
		}
	}
</style>
