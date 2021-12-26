<script context="module">
	export const load = async ({ page, fetch }) => {
		const { id } = page.params || 0;
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
	import PokemonLoader from '$lib/components/PokemonLoader.svelte';
	import PokemonStats from '$lib/components/PokemonStats/PokemonStats.svelte';
	import PokemonEvolutionChain from '$lib/components/PokemonEvolutionChain.svelte';
	import PokemonAbilities from '$lib/components/PokemonAbilities.svelte';
	import PokemonVarieties from '$lib/components/PokemonVarieties.svelte';

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
			<PokemonStats statistics={pokemon.stats} />
			<PokemonAbilities abilities={pokemon.abilities} />
			{#if specie.evolution_chain}
				<PokemonEvolutionChain evolutionChain={specie.evolution_chain} />
			{/if}
			{#if pokemon.forms.length || specie.varieties.length}
				<PokemonVarieties forms={pokemon.forms} varieties={specie.varieties} />
			{/if}
		</div>
	{:else}
		<PokemonLoader />
	{/if}
</div>

<style scoped>
	.page-details {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-end;
		height: 100%;
	}
</style>
