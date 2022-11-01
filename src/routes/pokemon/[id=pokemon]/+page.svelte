<script lang="ts">
	import type { Pokemon } from '$lib/types/Pokemon';
	import type { PokemonSpecie } from '$lib/types/PokemonSpecie';

	import PokemonCard from '$lib/components/pokemon/PokemonCard.svelte';
	import PokemonLoader from '$lib/components/shared/Loader.svelte';
	import PokemonStats from '$lib/components/pokemon/PokemonStats/PokemonStats.svelte';
	import PokemonEvolutionChain from '$lib/components/pokemon/PokemonEvolutionChain.svelte';
	import PokemonAbilities from '$lib/components/pokemon/PokemonAbilities.svelte';
	import PokemonVarieties from '$lib/components/pokemon/PokemonVarieties.svelte';
	import PokemonMoves from '$lib/components/pokemon/PokemonMoves.svelte';
	import PokemonScores from '$lib/components/pokemon/PokemonScores/PokemonScores.svelte';
	import PokemonLocations from '$lib/components/pokemon/PokemonLocations/PokemonLocations.svelte';

	import { locale } from '$lib/store/i18n/i18n';
	import type { PageData } from './$types';

	export let data: PageData;
	let pokemon: Pokemon = null;
	let specie: PokemonSpecie = null;

	$: {
		pokemon = data.pokemon;
		specie = data.specie;
	}

	$: pokemonName = specie.names?.find((name) => name.language.name === $locale.slice(0, 2)).name;
</script>

<svelte:head>
	<title>Kyuudex - {pokemonName} (N°{pokemon.id})</title>
</svelte:head>

<div class="pokemon-page">
	{#if pokemon}
		<div class="page-details">
			<PokemonCard
				id={`${pokemon.id}`}
				name={pokemonName}
				picture={pokemon.sprites?.front_default || ''}
				types={pokemon.types?.map(({ type }) => type.name)}
			/>
			<div>
				<PokemonScores
					height={pokemon.height}
					weight={pokemon.weight}
					rate={specie.capture_rate}
					steps={specie.hatch_counter}
					egg={specie.egg_groups?.map((egg) => egg.name)}
					gender={specie.gender_rate}
				/>
				<PokemonAbilities abilities={pokemon.abilities} />
			</div>
			<PokemonStats statistics={pokemon.stats} />
			{#if pokemon.moves?.length > 0}
				<PokemonMoves moves={pokemon.moves} />
			{/if}
			<PokemonLocations pokemon={pokemon.id} />
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

	.page-details div {
		display: flex;
		flex-direction: column;
	}

	@media screen and (max-width: 768px) {
		.page-details {
			display: grid;
			grid-template-columns: 100%;
			justify-content: center;
			width: 100%;
			align-items: center;
			justify-items: center;
			align-content: center;
		}

		.page-details div {
			width: 100%;
		}
	}

	@media screen and (min-width: 768px) {
		.page-details {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			width: 100%;
		}
	}
</style>
