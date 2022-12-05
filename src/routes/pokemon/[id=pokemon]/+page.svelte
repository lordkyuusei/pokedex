<script lang="ts">
	import type { Pokemon } from '$lib/types/Pokemon';
	import type { PokemonSpecie } from '$lib/types/PokemonSpecie';

	import PokemonCard from '$lib/components/pokemon/PokemonCard.svelte';
	import PokemonStats from '$lib/components/pokemon/PokemonStats/PokemonStats.svelte';
	import PokemonEvolutionChain from '$lib/components/pokemon/PokemonEvolutionChain.svelte';
	import PokemonAbilities from '$lib/components/pokemon/PokemonAbilities.svelte';
	import PokemonVarieties from '$lib/components/pokemon/PokemonVarieties.svelte';
	import PokemonMoves from '$lib/components/pokemon/PokemonMoves.svelte';
	import PokemonScores from '$lib/components/pokemon/PokemonScores/PokemonScores.svelte';
	import PokemonLocations from '$lib/components/pokemon/PokemonLocations/PokemonLocations.svelte';

	import { locale } from '$lib/store/i18n/i18n';
	import type { PageData } from './$types';
	import PokemonImagery from '$lib/components/pokemon/PokemonImagery.svelte';

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
	<meta name="description" content="Kyuudex - {pokemonName} (N°{pokemon.id})" />
</svelte:head>

<article class="pokemon-page">
	{#if pokemon}
		<header class="pokemon-identity">
			<PokemonCard
				id={`${pokemon.id}`}
				name={pokemonName}
				picture={pokemon.sprites?.front_default || ''}
				types={pokemon.types?.map(({ type }) => type.name)}
			/>
			<PokemonScores
				height={pokemon.height}
				weight={pokemon.weight}
				rate={specie.capture_rate}
				steps={specie.hatch_counter}
				egg={specie.egg_groups?.map((egg) => egg.name)}
				gender={specie.gender_rate}
			/>
			<PokemonAbilities abilities={pokemon.abilities} />
			<PokemonStats statistics={pokemon.stats} />
		</header>
		<section class="pokemon-environment">
			<PokemonMoves moves={pokemon?.moves} />
			<PokemonLocations pokemon={pokemon.id} />
			<PokemonEvolutionChain evolutionChain={specie?.evolution_chain} />
			<PokemonVarieties forms={pokemon.forms} varieties={specie.varieties} />
			<PokemonImagery id={pokemon.id} sprites={pokemon.sprites} />
		</section>
	{/if}
</article>

<style>
	.pokemon-identity,
	.pokemon-environment {
		height: 100%;
		width: 100%;
		display: grid;
		transition: all 0.2s ease-in-out;
	}

	.pokemon-identity {
		margin-bottom: 0.75rem;

		grid-template: 1fr 0.25fr / 0.8fr 1.2fr 1fr;
		gap: 0.75rem;
		grid-template-areas:
			'card scores stats'
			'card abilities stats';
	}

	@media screen and (max-width: 1024px) {
		.pokemon-identity {
			grid-template: 1fr 0.5fr 1.5fr/ 1fr 1fr;
			grid-template-areas:
				'card scores'
				'card abilities'
				'stats stats';
		}
	}

	@media screen and (max-width: 768px) {
		.pokemon-identity {
			grid-template: 1.2fr 1fr 0.5fr 1.5fr / 1fr;
			grid-template-areas:
				'card'
				'scores'
				'abilities'
				'stats';
		}
	}

	.pokemon-environment {
		grid-template: auto 1fr minmax(auto, 300px) minmax(auto, 300px) minmax(auto, 300px) / 1fr;
		gap: 0.75rem;
		grid-template-areas:
			'moves'
			'locations'
			'evolution'
			'varieties'
			'imagery';
	}

	.pokemon-identity > :global(.card):nth-child(1) {
		grid-area: card;
	}

	.pokemon-identity > :global(.card):nth-child(2) {
		grid-area: scores;
	}

	.pokemon-identity > :global(.card):nth-child(3) {
		grid-area: abilities;
	}

	.pokemon-identity > :global(.card):nth-child(4) {
		grid-area: stats;
	}

	.pokemon-environment > :global(.card):nth-child(1) {
		grid-area: moves;
	}

	.pokemon-environment > :global(.card):nth-child(2) {
		grid-area: locations;
	}

	.pokemon-environment > :global(.card):nth-child(3) {
		grid-area: evolution;
	}

	.pokemon-environment > :global(.card):nth-child(4) {
		grid-area: varieties;
	}

	.pokemon-environment > :global(.card):nth-child(5) {
		grid-area: imagery;
	}
</style>
