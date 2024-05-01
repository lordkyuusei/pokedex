<script lang="ts">
	import Switch from '$lib/components/common/Switch.svelte';
	import battleFrontier from '$lib/constants/battle-factory';
	import type { FactoryPokemon } from '$lib/types/battle-factory';
	import PokemonCard from './PokemonCard.svelte';

	let searchInput: string = '';
	let isLvl100Mode: boolean;

	$: matchingResult = onSearchChange(searchInput);

	const onSearchChange = async (input: string): Promise<FactoryPokemon[]> =>
		await new Promise((res, rej) => {
			if (searchInput.length > 3) {
				const result: FactoryPokemon[] = battleFrontier.filter((elem) =>
					elem.name?.toLowerCase().includes(searchInput.toLowerCase())
				);
				res(result);
			} else {
				res([]);
			}
		});
</script>

<section id="tool-battle-frontier">
	<header>
		<input type="search" bind:value={searchInput} />
		<Switch
			event="isLvl100Mode"
			icon="pokedex"
			on:isLvl100Mode={(e) => (isLvl100Mode = e.detail.isLvl100Mode)}
		/>
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
		position: sticky;
		top: 0svh;
		display: flex;
		gap: var(--normal-gap);
		padding: var(--small-gap);
		background: var(--background-color-__);
		border-radius: var(--smaller-gap) var(--smaller-gap) 0 0;
	}

	output {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(33%, 1fr));

		background: hsl(232, 28%, 16%);
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
