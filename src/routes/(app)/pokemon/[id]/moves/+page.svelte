<svelte:options immutable />

<script lang="ts">
	import { fade } from 'svelte/transition';

	import { lang } from '$lib/store/lang';
	import { browser } from '$app/environment';
	import { generation, version } from '$lib/store/generation';
	import { extractMovesV2, filterMoves, searchMoves } from '$lib/functions/extractMoves';

	import type { PageData } from './$types';
	import type { SearchOption, SortOption } from '$lib/types/moves';
	import type { MoveLight } from '$lib/types/pokeapi/move';
	import type { EntityRef, Pokemon } from '$lib/types/pokeapi/pokemon';

	export let data: PageData;

	let versionMoveset: MoveLight[] = [];
	let displayMoveset: MoveLight[] = [];

	let searchOptions: string[] = [];
	let movesetProperties: string[] = [];
	let filteredMoveset: MoveLight[] = [];

	let selectMove: string = '';
	let searchText: string = '';
	let searchOption: SearchOption = 'level-up';
	let sortOption: SortOption = { option: 'level', direction: 'asc' };

	$: if (searchText || searchOption || sortOption) updateMoveTable(versionMoveset);
	$: if (browser && data.pokemon && $version) updateVersionMoveset(data.pokemon);
	$: if (browser && versionMoveset.length) handleFullMovesetChange(versionMoveset);

	const updateVersionMoveset = (pokemon: Pokemon) => {
		const { moves } = pokemon;
		const movesId = moves.map((_) => _.move.name).join(',');

		fetch(`/api/moves?generation=${$generation.id}&moves=${movesId}`).then(async (res) => {
			const moveDetails = await res.json();
			versionMoveset = extractMovesV2(moves, moveDetails, $version);
		});
	};

	const updateMoveTable = (moves: MoveLight[]) => {
		filteredMoveset = filterMoves(moves, searchOption);
		displayMoveset = searchMoves(filteredMoveset, searchText, sortOption, $lang);
	};

	const handleFullMovesetChange = (moves: MoveLight[]) => {
		const notInTableHead = ['id', 'description', 'method'];
		searchOptions = [...new Set(moves.map((m) => m.method.name))];
		movesetProperties = Object.keys(moves[0]).filter((prop) => !notInTableHead.includes(prop));

		updateMoveTable(moves);
	};

	const updateSort = (category: string) => {
		const { option } = sortOption;
		sortOption =
			option === category
				? { ...sortOption, direction: sortOption.direction === 'asc' ? 'desc' : 'asc' }
				: { option: category, direction: 'asc' };

		updateMoveTable(versionMoveset);
	};

	const mapPropToTag = {
		level: (level: number) => (level <= 1 ? 'Départ' : level),
		name: (name: string) => name[$lang],
		type: (type: EntityRef) => `<img src="/icons/${type.name}.png" alt="${type.name}">`,
		power: (power: string | undefined) => power ?? '---',
		accuracy: (accuracy: string | undefined) => accuracy ?? '---',
		pp: (pp: string) => pp,
		category: (category: string) => category,
		damageClass: (move: string) => `<img src="/icons/${move}.png" alt="${move}">`
	};
</script>

<section in:fade id="data-moves">
	<div id="moves">
		<header id="moves-options">
			<div id="options-search-group">
				<input id="options-search" bind:value={searchText} />
				<img class="search-icon" src="/dex-search.svg" alt="logo" />
			</div>
			<select id="options-select" bind:value={searchOption}>
				{#each searchOptions as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</header>
		<div id="moves-table">
			<table id="table">
				<thead id="table-head">
					<tr>
						{#each movesetProperties as category}
							<th id="head-{category}" on:click={() => updateSort(category)}>{category}</th>
						{/each}
						<th id="head-actions"></th>
					</tr>
				</thead>
				<tbody id="table-body">
					{#if displayMoveset.length === 0}
						<tr><td colspan="12">Pas d'attaques pour {$version}</td></tr>
					{/if}
					{#each displayMoveset as move (move.id)}
						<tr on:click={() => (selectMove = move.id)}>
							{#each movesetProperties as category}
								<td id="move-{move?.id}-{category}">
									{@html mapPropToTag[category](move[category])}
								</td>
							{/each}
							<td id="move-{move?.id}-link">
								<a href="/moves/{move.type?.name}/{move.id}"><button>*</button></a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>

<style>
	#data-moves {
		padding: var(--small-gap);
		width: 100%;
		overflow-y: auto;

		& > div#moves {
			display: grid;
			grid-template:
				'moves-options' 1fr
				'moves-table' 10fr / 100%;

			height: 100%;
			width: 100%;
			border-radius: var(--border-r-50);
			overflow-y: auto;
			background-color: var(--background-second-color);
			box-shadow: var(--box-shadow);

			& > header#moves-options {
				display: flex;
				justify-content: start;
				gap: var(--normal-gap);
				padding: var(--smaller-gap) var(--small-gap);

				& > div#options-search-group {
					display: grid;
					grid-template: 1fr / 1fr;
					align-items: center;
					justify-items: flex-end;

					& > :is(#options-search, .search-icon) {
						grid-area: 1/1;
					}

					& > #options-search {
						border-radius: var(--border-r-100);
						background-color: var(--background-color);
						color: var(--text-color);
						padding: var(--smaller-gap) var(--normal-gap);
					}

					& > .search-icon {
						margin-right: 1em;
						height: 70%;
					}
				}

				& > select#options-select {
					cursor: pointer;
					border: none;
					text-align: center;
					text-transform: uppercase;
					border-radius: var(--border-r-50);
					padding: var(--smaller-gap) var(--small-gap);

					&,
					& option {
						background: var(--text-color);
						color: var(--background-second-color);
					}
				}
			}

			& > #moves-table {
				width: 100%;
				overflow-y: auto;

				& > #table {
					width: 100%;
					overflow-y: auto;
					border-collapse: collapse;
					table-layout: fixed;
					transition: all var(--transition-duration) var(--transition-function);

					& > #table-head {
						position: sticky;
						z-index: 1;
						top: 0;

						& th {
							width: 100%;
							cursor: pointer;
							border: none;
							font-weight: bolder;
							text-transform: capitalize;
							padding-block: var(--small-gap);
							color: var(--background-color);
							background-color: var(--text-color);
							transition: all var(--transition-duration) var(--transition-function);

							&:hover {
								background-color: var(--second-color);
							}
						}
					}

					& > #table-body {
						& > tr:has(td[id^='move-']:not([id$='-description'])) {
							cursor: pointer;
						}

						& > tr:has(td[id$='-description']) {
							border: 1px solid var(--primary-color);
						}

						& > tr:has(td[id^='move-']:not([id$='-description'])):hover > td {
							background-color: var(--background-alt-color);
							transition: all 0.05s var(--transition-function);
						}

						& td[id^='move-'] {
							text-align: center;
							padding: 1em;
						}
					}
				}
			}
		}
	}

	@media (max-width: 640px) {
		#data-moves {
			padding: 0;
		}

		#data-moves > #moves {
			border-radius: 0;
			height: 100%;
		}

		table :is(td, th):nth-child(n + 5) {
			display: none;
		}
	}
</style>
