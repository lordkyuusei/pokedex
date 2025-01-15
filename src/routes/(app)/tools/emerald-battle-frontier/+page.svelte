<script lang="ts">
	import Select from '$lib/components/common/Select.svelte';
	import Switch from '$lib/components/common/Switch.svelte';
	import PokemonCard from '$lib/components/features/tools/PokemonCard.svelte';
	import { factoryPokemonList, openLevelPokemonStart } from '$lib/constants/battle-factory';
	import type { FactoryPokemon } from '$lib/types/battle-factory';

	let searchInput: string = '';
	let movesFilter: string[] = [];
	let itemFilter: string[] = [];
	let isLvl100Mode: boolean = true;
	let showFilters: boolean;
	let starredPokemon: FactoryPokemon[] = [];

	$: matchingResult = onSearchChange(searchInput, movesFilter, itemFilter);
	$: possibleMoves = onMovesChange(matchingResult);
	$: possibleItems = onItemsChange(matchingResult);

	const resetSearch = () => {
		movesFilter = [];
		itemFilter = [];
	};

	const onSearchChange = (
		input: string,
		movesFilter: string[],
		itemFilter: string[]
	): FactoryPokemon[] => {
		if (input.length > 3) {
			const result: FactoryPokemon[] = factoryPokemonList.filter((elem) => {
				const isNameMatching = elem.name?.toLowerCase().includes(input.toLowerCase());
				const isLvlMatching = isLvl100Mode
					? elem.id >= openLevelPokemonStart
					: elem.id < openLevelPokemonStart;
				const areMovesMatching = checkAreMovesMatching(
					[elem['1stMove'], elem['2ndMove'], elem['3rdMove'], elem['4thMove']],
					movesFilter
				);
				const isItemMatching = !itemFilter.length ? true : elem.item === itemFilter[0];
				return isNameMatching && isLvlMatching && areMovesMatching && isItemMatching;
			});
			return result;
		} else {
			resetSearch();
			return [];
		}
	};

	const onMovesChange = (result: FactoryPokemon[]): string[] => {
		return [
			...new Set(
				result.flatMap((pokemon) => [
					pokemon['1stMove'],
					pokemon['2ndMove'],
					pokemon['3rdMove'],
					pokemon['4thMove']
				])
			)
		];
	};

	const onItemsChange = (result: FactoryPokemon[]): string[] => {
		return [...new Set(result.map((pokemon) => pokemon.item))];
	};

	const checkAreMovesMatching = (moveset: string[], filteredMoves: string[]) => {
		return filteredMoves.every((move) => moveset.includes(move));
	};

	const toggleStarredPokemon = (e: CustomEvent<number>) => {
		const id = e.detail;
		const shouldRemove = starredPokemon.findIndex((x) => x.id === id) !== -1;
		const indexInMatches = matchingResult.findIndex((x) => x.id === id);

		if (indexInMatches === -1 && shouldRemove) {
			starredPokemon = [...starredPokemon.filter((x) => x.id !== id)];
		}

		if (indexInMatches !== -1) {
			const updatedPokemon = {
				...matchingResult[indexInMatches],
				meta: { isStarred: !matchingResult[indexInMatches].meta.isStarred }
			};

			matchingResult = matchingResult.with(indexInMatches, updatedPokemon);

			starredPokemon = shouldRemove
				? [...starredPokemon.filter((x) => x.id !== id)]
				: [...starredPokemon, updatedPokemon];
		}
	};
</script>

<section id="tool-battle-frontier">
	<header class:expand={showFilters}>
		<div class="search">
			<input type="search" bind:value={searchInput} placeholder="Nom du pokémon" />
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
		</div>
		{#if showFilters && possibleMoves && possibleItems}
			<Select
				name="Capacités"
				items={possibleMoves}
				bind:checkedItems={movesFilter}
			></Select>
			<Select name="Objets" items={possibleItems} bind:checkedItems={itemFilter}></Select>
		{/if}
	</header>
	<output>
		{#each starredPokemon as pokemon (pokemon.id)}
			<PokemonCard {pokemon} on:star={toggleStarredPokemon}></PokemonCard>
		{/each}
		{#if starredPokemon.length > 0}
			<hr />
		{/if}
		{#if !matchingResult || matchingResult.length === 0}
			Pas de résultat
		{:else}
			{#each matchingResult as pokemon (pokemon.id)}
				{#if pokemon.meta.isStarred === false}
					<PokemonCard {pokemon} on:star={toggleStarredPokemon}></PokemonCard>
				{/if}
			{/each}
		{/if}
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
			border-radius: var(--smaller-gap);
			box-shadow: var(--box-shadow);
			margin-bottom: var(--small-gap);
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
				grid-column: 1 / -1;
				grid-auto-flow: column;
				grid-template-columns: 1fr repeat(4, auto);
				align-items: center;
				gap: var(--small-gap);

				@media (max-width: 640px) {
					grid-template-rows: 1fr auto;
					grid-auto-columns: auto;

					& > input {
						grid-column: 4 span;
					}

					& > :not(input) {
						grid-row: 2;
					}
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
			grid-auto-rows: auto;
			align-content: start;

			overflow-y: auto;
			padding: var(--small-gap);
			background: var(--background-second-color);
			border-radius: var(--smaller-gap);
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
