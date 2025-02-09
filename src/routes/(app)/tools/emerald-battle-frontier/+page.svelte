<script lang="ts">
	import { onMount } from 'svelte';

	import Select from '$lib/components/fragments/Select.svelte';
	import Switch from '$lib/components/fragments/Switch.svelte';
	import type { FactoryPokemon } from '$lib/types/battle-factory';
	import { openLevelPokemonStart } from '$lib/constants/battle-factory';
	import PokemonCard from '$lib/components/lodestones/pokemon/PokemonCard.svelte';

	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let searchInput: string = '';
	let movesFilter: string[] = [];
	let itemFilter: string[] = [];

	let isLvl100Mode: boolean = true;
	let showFilters: boolean = false;
	let currentRound: number = 1;
	let dropboxUrlDown: boolean = false;

	let teamedPokemon: FactoryPokemon[] = [];
	let pinnedPokemon: FactoryPokemon[] = [];
	let factoryPokemonList: FactoryPokemon[] = [];

	$: availablePokemon = onRoundChange(factoryPokemonList, currentRound);
	$: matchingResult = onSearchChange(availablePokemon, searchInput, movesFilter, itemFilter);
	$: possibleMoves = onMovesChange(matchingResult);
	$: possibleItems = onItemsChange(matchingResult);

	const resetSearch = () => {
		movesFilter = [];
		itemFilter = [];
	};

	const onRoundChange = (pokemonList: FactoryPokemon[], currentRound: number) =>
		pokemonList.filter((pokemon) =>
			checkIsVariantMatching(pokemon.variant, currentRound, isLvl100Mode)
		);

	const onSearchChange = (
		list: FactoryPokemon[],
		input: string,
		moves: string[],
		item: string[]
	): FactoryPokemon[] => {
		if (input.length <= 2) {
			resetSearch();
			return [];
		}

		const result: FactoryPokemon[] = list.filter((pkmn) => {
			const { id, '1stMove': fMove, '2ndMove': sMove, '3rdMove': tMove, '4thMove': lMove } = pkmn;

			const isItemMatching = !item.length ? true : pkmn.item === item[0];
			const nameMatch = pkmn.name.toLowerCase().startsWith(input.toLowerCase());
			const movesMatch = checkAreMovesMatching([fMove, sMove, tMove, lMove], moves);
			const lvlMatch = isLvl100Mode ? id >= openLevelPokemonStart : id < openLevelPokemonStart;

			return nameMatch && lvlMatch && movesMatch && isItemMatching;
		});
		return result;
	};

	const onMovesChange = (result: FactoryPokemon[]): string[] => [
		...new Set(
			result.flatMap((pokemon) => [
				pokemon['1stMove'],
				pokemon['2ndMove'],
				pokemon['3rdMove'],
				pokemon['4thMove']
			])
		)
	];

	const onItemsChange = (result: FactoryPokemon[]): string[] => [
		...new Set(result.map((pokemon) => pokemon.item))
	];

	const checkAreMovesMatching = (moveset: string[], filteredMoves: string[]) =>
		filteredMoves.every((move) => moveset.includes(move));

	/* Not suitable for lv50 yet */
	const checkIsVariantMatching = (variant: number, currentRound: number, isLvl100Mode: boolean) => {
		if (isLvl100Mode && currentRound <= 4) return variant === currentRound;
		else return true;
	};

	const togglepinnedPokemon = (e: CustomEvent<number>) => {
		const id = e.detail;
		const shouldRemove = pinnedPokemon.findIndex((x) => x.id === id) !== -1;
		const indexInMatches = matchingResult.findIndex((x) => x.id === id);

		if (indexInMatches === -1 && shouldRemove) {
			pinnedPokemon = [...pinnedPokemon.filter((x) => x.id !== id)];
		}

		if (indexInMatches !== -1) {
			const updatedPokemon = {
				...matchingResult[indexInMatches],
				meta: { isStarred: !matchingResult[indexInMatches].meta.isStarred }
			};

			matchingResult = matchingResult.with(indexInMatches, updatedPokemon);

			pinnedPokemon = shouldRemove
				? [...pinnedPokemon.filter((x) => x.id !== id)]
				: [...pinnedPokemon, updatedPokemon];
		}
	};

	const parseHeading = (index: number, value: string) => {
		const mapIndexToFunction = [
			{ index: 0, heading: 'id' },
			{ index: 1, heading: 'name' },
			{ index: 2, heading: 'variant' },
			{ index: 3, heading: 'nature' },
			{ index: 4, heading: 'item' },
			{ index: 5, heading: '1stMove' },
			{ index: 6, heading: '2ndMove' },
			{ index: 7, heading: '3rdMove' },
			{ index: 8, heading: '4thMove' },
			{ index: 9, heading: 'ability' },
			{ index: 10, heading: 'evs' },
			{ index: 11, heading: 'lv100Stats' },
			{ index: 13, heading: 'lv50Stats' }
		];

		return mapIndexToFunction.find((x) => x.index === index)?.heading ?? value;
	};

	const parseCell = (index: number, value: string) => {
		const mapIndexToFunction = [
			{ index: 2, fx: (value: string) => Number(value) ?? 0 },
			{ index: 10, fx: (value: string) => value.replace(' ', '').split('/').map(Number) },
			{ index: 11, fx: (value: string) => value.split('/').map(Number) },
			{ index: 13, fx: (value: string) => value.split('/').map(Number) }
		];

		return mapIndexToFunction.find((x) => x.index === index)?.fx(value) ?? value;
	};

	const loadBattleFrontierRoster = (battleFrontierSheet: string) => {
		const parser = new DOMParser();

		const pageHtml = parser.parseFromString(battleFrontierSheet, 'text/html');
		const rows: NodeListOf<HTMLTableRowElement> = pageHtml.querySelectorAll('table.aaa>tbody>tr');

		const [head, ...body] = Array.from(rows);
		const cells = head.querySelectorAll('td');
		const headers = Array.from(cells).map((x) => x.innerText);

		factoryPokemonList = Array.from(body).reduce((json, row) => {
			const cells = row.querySelectorAll('td');
			const values = Array.from(cells).map((x) => x.innerText);

			if (values.every((x) => x === '') || values[1] === '') return json;
			return [
				...json,
				headers.reduce(
					(obj, heading, i) => ({
						...obj,
						[parseHeading(i, heading)]: parseCell(i, values[i])
					}),
					{ meta: { isStarred: false } } as FactoryPokemon
				)
			];
		}, [] as FactoryPokemon[]);

		dropboxUrlDown = false;
	};

	
	const clearForm = (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
		pinnedPokemon = [];
		searchInput = '';
	};
	
	
	const fetchBattleFrontierSheet = async (event: Event & { currentTarget: EventTarget & HTMLInputElement; }) => {
		const result = await fetch('/api/tools/emerald-battle-frontier?id=' + event.currentTarget.value);
		const battleFrontierSheet = await result.text();
		loadBattleFrontierRoster(battleFrontierSheet);
	}

	onMount(async () => {
		if (data.battleFrontierSheet) return loadBattleFrontierRoster(data.battleFrontierSheet);
		else {
			dropboxUrlDown = true;
		}
	});
</script>

<section id="tool-battle-frontier">
	<header class:expand={showFilters}>
		<div class="search">
			<button on:click={clearForm}>🧹</button>
			<input
				type="search"
				bind:value={searchInput}
				disabled={factoryPokemonList.length === 0}
				placeholder="Nom du pokémon"
			/>
			<label for="isLvl100Mode">Nv. 50 / 100</label>
			<Switch
				event="isLvl100Mode"
				icon="pokedex"
				defaultState={isLvl100Mode}
				on:isLvl100Mode={(e) => (isLvl100Mode = e.detail.isLvl100Mode)}
			/>
			<label for="showFilters">Filtres</label>
			<Switch
				event="showFilters"
				icon="shiny"
				on:showFilters={(e) => (showFilters = e.detail.showFilters)}
			/>
			<label for="currentRound">Round N°</label>
			<select id="currentRound" bind:value={currentRound}>
				{#each [...new Array(7)] as _, index}
					<option value={index + 1}>{index + 1}{index === 6 ? '+' : ''}</option>
				{/each}
			</select>
		</div>
		{#if showFilters && possibleMoves && possibleItems}
			<Select name="Capacités" items={possibleMoves} bind:checkedItems={movesFilter}></Select>
			<Select name="Objets" items={possibleItems} bind:checkedItems={itemFilter}></Select>
		{/if}
	</header>
	<output>
		{#if dropboxUrlDown}
			Dropbox URL down. Get the new documentID with the link below.
			<a
				href="https://www.dropbox.com/scl/fi/vd8o0yarnwpvn0dodb4bd/EmeraldBattleFrontierComplete.xlsx?rlkey=uu0i23o648p7klsummu9ihjtk&e=6"
				>Click here.</a
			>
			<input type="text" on:change={fetchBattleFrontierSheet}>
		{/if}
		{#each pinnedPokemon as pokemon (pokemon.id)}
			<PokemonCard isLvl100Mode {pokemon} on:star={togglepinnedPokemon}></PokemonCard>
		{/each}
		{#if pinnedPokemon.length > 0}
			<hr />
		{/if}
		{#each matchingResult as pokemon (pokemon.id)}
			{#if pokemon.meta.isStarred === false}
				<PokemonCard
					{pokemon}
					isLvl100Mode
					open={matchingResult.length === 1}
					on:star={togglepinnedPokemon}
				></PokemonCard>
			{/if}
		{/each}
	</output>
</section>

<style>
	section#tool-battle-frontier {
		padding: var(--small-gap);
		width: 100%;
		overflow-y: auto;

		& > header {
			position: sticky;
			top: 0;
			display: grid;
			grid-template: 'search search' 1fr / 1fr 1fr;
			gap: var(--small-gap);
			padding: var(--small-gap);
			background: var(--background-second-color);
			border-radius: var(--smaller-gap) var(--smaller-gap) 0 0;
			z-index: 2;

			&.expand {
				grid-template: 'search search' 1fr 'moves item' 1fr / 1fr 1fr;
			}

			@media (max-width: 640px) {
				grid-template: 'search search' 1fr / 1fr 1fr;

				&.expand {
					grid-template: 'search search' 1fr 'moves item' 0.5fr / 1fr 1fr;
				}
			}

			& > div.search {
				display: grid;
				grid-auto-flow: column;
				grid-template-columns: auto 1fr repeat(4, auto);
				align-items: center;
				grid-column: 1 / -1;
				gap: var(--small-gap);

				@media (max-width: 640px) {
					grid-template-rows: 1fr auto;

					& > input {
						grid-area: 1 / 1 / 1 / -1;
					}

					& > :not(input) {
						grid-row: 2;
					}

					& > button {
						grid-area: 1 / -1;
					}
				}

				& > button {
					height: 100%;
				}

				& > input {
					background-color: var(--background-second-color);
				}

				& .selected {
					color: var(--background-color);
					background-color: var(--accent-color);
				}
			}
		}

		& > output {
			display: grid;
			gap: var(--small-gap);
			grid-auto-rows: auto;
			align-content: start;

			overflow-y: auto;
			padding: 0 var(--small-gap) var(--small-gap) var(--small-gap);
			background: var(--background-second-color);
			border-radius: 0 0 var(--smaller-gap) var(--smaller-gap);
			box-shadow: var(--box-shadow);

			@media (max-width: 640px) {
				grid-auto-flow: row;
				grid-template-columns: 1fr;
			}

			& > hr {
				height: var(--smaller-gap);
				width: 100%;
				border: none;
				border-radius: var(--border-r-50);
				background-color: var(--second-color);
			}
		}
	}

	@media (max-width: 640px) {
		section#tool-battle-frontier {
			padding: 0;
		}
	}
</style>
