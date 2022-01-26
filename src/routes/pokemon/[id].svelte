<script context="module">
	export const load = async ({ params, fetch }) => {
		const { id } = params || 0;
		const result = await fetch(`/pokemon/${id}.json`);

		if (result.ok) {
			const { pokemon, specie } = await result.json();

			return {
				props: {
					pokemon,
					specie
				}
			};
		}
	};
</script>

<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';

	import type { Pokemon } from '$lib/types/Pokemon';
	import type { PokemonSpecie } from '$lib/types/PokemonSpecie';

	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import PokemonLoader from '$lib/components/PokemonLayouts/PokemonLoader.svelte';
	import PokemonStats from '$lib/components/PokemonStats/PokemonStats.svelte';
	import PokemonEvolutionChain from '$lib/components/PokemonEvolutionChain.svelte';
	import PokemonAbilities from '$lib/components/PokemonUIData/PokemonAbilities.svelte';
	import PokemonVarieties from '$lib/components/PokemonUIData/PokemonVarieties.svelte';
	import PokemonMoves from '$lib/components/PokemonUIData/PokemonMoves.svelte';
	import PokemonScores from '$lib/components/PokemonScores/PokemonScores.svelte';

	export let pokemon: Pokemon = null;
	export let specie: PokemonSpecie = null;

	onMount(() => {});
	afterUpdate(() => {});
</script>

<div class="pokemon-page">
	{#if pokemon}
		<div class="page-details">
			<PokemonCard
				id={`${pokemon?.id}`}
				name={pokemon?.name}
				picture={pokemon?.sprites?.front_default || ''}
				types={pokemon?.types?.map(({ type }) => type.name)}
			/>
			<PokemonScores
				height={pokemon.height}
				weight={pokemon.weight}
				rate={specie.capture_rate}
				steps={specie.hatch_counter}
				egg={specie.egg_groups?.map((egg) => egg.name)}
				gender={specie.gender_rate}
			/>
			<PokemonStats statistics={pokemon.stats} />
			<PokemonAbilities abilities={pokemon.abilities} />
			{#if pokemon.moves.length > 0}
				<PokemonMoves moves={pokemon.moves} />
			{/if}
			{#if specie.evolution_chain}
				<PokemonEvolutionChain evolutionChain={specie.evolution_chain} />
			{/if}
			{#if pokemon?.forms?.length > 1 || specie?.varieties?.length > 1}
				<PokemonVarieties forms={pokemon.forms} varieties={specie.varieties} />
			{/if}
		</div>
	{:else}
		<PokemonLoader />
	{/if}
</div>

<style>
	.page-details {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-end;
		height: 100%;
	}

	@media screen and (max-width: 720px) {
		.page-details {
			display: grid;
			grid-template-columns: 100%;
			justify-content: center;
			width: 100%;
			align-items: center;
			justify-items: center;
			align-content: center;
		}
	}

	@media screen and (min-width: 720px) {
		.page-details {
			display: flex;
			width: 100%;
			align-items: center;
			justify-items: center;
			align-content: center;
		}
	}
</style>
