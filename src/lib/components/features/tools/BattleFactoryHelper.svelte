<script lang="ts">
	import Switch from '$lib/components/common/Switch.svelte';
	import { factoryPokemonList, openLevelPokemonStart } from '$lib/constants/battle-factory';
	import type { FactoryPokemon } from '$lib/types/battle-factory';
	import PokemonCard from './PokemonCard.svelte';

	let searchInput: string = '';
	let movesFilter: string[] = [];
	let itemFilter: string | null = null;
	let isLvl100Mode: boolean;
	let showFilters: boolean;

	$: matchingResult = onSearchChange(searchInput, movesFilter, itemFilter);
	$: possibleMoves = onMovesChange(matchingResult);
	$: possibleItems = onItemsChange(matchingResult);

	const resetSearch = () => {
		movesFilter = [];
		itemFilter = null;
	};

	const onSearchChange = async (
		input: string,
		movesFilter: string[],
		itemFilter: string | null
	): Promise<FactoryPokemon[]> =>
		await new Promise((res, rej) => {
			if (input.length > 3) {
				const result: FactoryPokemon[] = factoryPokemonList.filter((elem) => {
					const isNameMatching = elem.name?.toLowerCase().includes(input.toLowerCase());
					const isLvlMatching = isLvl100Mode
						? elem.id < openLevelPokemonStart
						: elem.id >= openLevelPokemonStart;
					const areMovesMatching = checkAreMovesMatching(
						[elem['1stMove'], elem['2ndMove'], elem['3rdMove'], elem['4thMove']],
						movesFilter
					);
					const isItemMatching = !itemFilter ? true : elem.item === itemFilter;
					return isNameMatching && isLvlMatching && areMovesMatching && isItemMatching;
				});
				res(result);
			} else {
				resetSearch();
				res([]);
			}
		});

	const onMovesChange = async (result: Promise<FactoryPokemon[]>): Promise<string[]> => {
		const list = await result;
		return [
			...new Set(
				list.flatMap((pokemon) => [
					pokemon['1stMove'],
					pokemon['2ndMove'],
					pokemon['3rdMove'],
					pokemon['4thMove']
				])
			)
		];
	};

	const onItemsChange = async (result: Promise<FactoryPokemon[]>): Promise<string[]> => {
		const list = await result;
		return [...new Set(list.map((pokemon) => pokemon.item))];
	};

	const checkAreMovesMatching = (moveset: string[], filteredMoves: string[]) => {
		return filteredMoves.every((move) => moveset.includes(move));
	};

	const toggleMoveInList = (move: string) => {
		movesFilter = movesFilter.includes(move)
			? movesFilter.filter((elem) => elem !== move)
			: [...movesFilter, move];
	};

	const isMoveIncluded = (move: string) => movesFilter.includes(move);
	const toggleItem = (item: string) => (itemFilter = !itemFilter ? item : null);
</script>

<section id="tool-battle-frontier">
	<header>
		<div>
			<input type="search" bind:value={searchInput} placeholder="Nom du pokémon" />
			<label for="isLvl100Mode">Nv. 50 / 100</label>
			<Switch
				event="isLvl100Mode"
				icon="pokedex"
				on:isLvl100Mode={(e) => (isLvl100Mode = e.detail.isLvl100Mode)}
			/>
			<label for="showFilters">Filtres</label>
			<Switch
				event="showFilters"
				icon="shiny"
				on:showFilters={(e) => (showFilters = e.detail.showFilters)}
			/>
		</div>
		{#if showFilters}
			<div class="filter-moves">
				<span>Capacité:</span>
				{#await possibleMoves then moves}
					{#each moves as move}
						<button class:selected={isMoveIncluded(move)} on:click={() => toggleMoveInList(move)}
							>{move}</button
						>
					{/each}
				{/await}
			</div>
			<div class="filter-items">
				<span>Objet tenu:</span>
				{#await possibleItems then items}
					{#each items as item}
						<button class:selected={itemFilter === item} on:click={() => toggleItem(item)}
							>{item}</button
						>
					{/each}
				{/await}
			</div>
		{/if}
	</header>
	<output>
		{#await matchingResult}
			Loading...
		{:then result}
			{#if !result || result.length === 0}
				Pas de résultat
			{:else}
				{#each result as pokemonInstance}
					<PokemonCard pokemon={pokemonInstance} {isLvl100Mode}></PokemonCard>
				{/each}
			{/if}
		{/await}
	</output>
</section>

<style>
	section#tool-battle-frontier {
		overflow-y: auto;
	}

	header {
		display: grid;
		grid-auto-rows: auto;
		gap: var(--small-gap);
		position: sticky;
		top: 0svh;
		padding: var(--small-gap);
		background: var(--background-color-__);
		border-radius: var(--smaller-gap) var(--smaller-gap) 0 0;

		& > div {
			display: flex;
			align-items: center;
			gap: var(--small-gap);

			& .selected {
				background-color: var(--background-color-____);
			}
		}

		& > .filter-moves,
		.filter-items {
			display: grid;
			grid-auto-columns: max-content;
			grid-auto-flow: column;
			overflow-x: auto;
		}
	}

	output {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(33%, 1fr));

		background: var(--background-color-____);
		gap: var(--small-gap);
		padding: var(--small-gap);
		margin-block: var(--small-gap);
		border-radius: var(--smaller-gap) var(--smaller-gap) 0 0;
		overflow-y: auto;

		@media (max-width: 640px) {
			grid-auto-flow: row;
			grid-template-columns: 1fr;
		}
	}
</style>
