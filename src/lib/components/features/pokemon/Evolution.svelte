<script lang="ts">
	import { fade } from 'svelte/transition';

	import type {
		EvolutionChain,
		EvolutionUnit,
		PokemonEvolution
	} from '$lib/types/pokeapi/evolution';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';

	import Trigger from './evolution/Trigger.svelte';
	import OneWay from './evolution/OneWay.svelte';
	import TwoWays from './evolution/TwoWays.svelte';
	import ThreeWays from './evolution/ThreeWays.svelte';
	import EeveeWays from './evolution/EeveeWays.svelte';
	import { navigatePokemon } from '$lib/functions/navigate';
	import { page } from '$app/stores';

	export let evolution: PokemonEvolution;

	const mapSizeToComponent = {
		'1': OneWay,
		'2': TwoWays,
		'3': ThreeWays,
		'8': EeveeWays
	};

	let pokemonStages = new Map<number, EvolutionUnit[]>();

	$: ({ id: pokemonId } = evolution);
	$: updateOnIdChange(pokemonId);

	const updateOnIdChange = (_: number) => {
		pokemonStages.clear();
		extractEvolutionChain(evolution.chain);
	};

	const extractEvolutionChain = (chain: EvolutionChain, level: number = 1) => {
		if (!chain) return;
		const { species, evolves_to, evolution_details } = chain;
		if (species && evolves_to.length) {
			const { url } = species;
			const evolutionUnit: EvolutionUnit = {
				name: url.match(/\d+/g)?.pop() ?? '',
				trigger: evolution_details
			};
			pokemonStages.set(level, [...(pokemonStages.get(level) || []), evolutionUnit]);
			evolves_to.forEach((evolutionUnit) => extractEvolutionChain(evolutionUnit, level + 1));
		} else {
			const addition = [
				...(pokemonStages.get(level) || []),
				{ name: species.url.match(/\d+/g)?.pop() ?? '', trigger: evolution_details }
			];
			pokemonStages = new Map([...pokemonStages, [level, addition]]);
			return;
		}
	};
</script>

<section id="evolution-{pokemonId}-{pokemonStages.size}">
	{#each [...pokemonStages] as [level, evolutionUnits], i (level)}
		<!-- Affichage du/des triggers-->
		{#if level > 1 && evolutionUnits.length}
			<section id="{level}-evolution-triggers" in:fade={{ delay: i * 100 }}>
				{#each evolutionUnits as unit, i (unit.name)}
					<Trigger {unit} size={evolutionUnits.length} />
				{/each}
			</section>
		{/if}

		<!-- Affichage du/des Pokémon & des avant/après-->
		<section id="{pokemonId}-{level}-evolution-stage">
			{#if level > 1}
				<section id="{level}-{i}-prevs" in:fade={{ delay: i * 100 }}>
					{#each evolutionUnits as _, i}
						<span id="{level}-{i}-stage-prev" />
					{/each}
				</section>
			{/if}
			<section id="{level}-stage-pokemon" in:fade={{ delay: i * 100 }}>
				{#each evolutionUnits as unit, i (unit.name)}
					<a href={navigatePokemon(unit.name, $page)}>
						<img src={fetchPokemonSpriteURL(Number(unit.name))} alt={unit.name} />
					</a>
				{/each}
			</section>
			{#if level < pokemonStages.size}
				<section id="{level}-{i}-nexts" in:fade={{ delay: i * 100 }}>
					{#each evolutionUnits as unit, i}
						<svelte:component this={mapSizeToComponent[pokemonStages.get(level + 1)?.length]} />
					{/each}
				</section>
			{/if}
		</section>
	{/each}
</section>

<style>
	[id^='evolution'] {
		display: grid;
		height: 100%;
		width: 100%;

		overflow-y: auto;
		grid-auto-flow: column;
		grid-auto-columns: minmax(1em, 1fr);

		border-radius: var(--border-r-200);
		background-color: var(--background-color-__);
		box-shadow: var(--box-shadow);
	}

	[id^='evolution'][id$='2'] {
		grid-template-columns: 1fr 2fr 1fr;
	}

	[id$='-evolution-stage'] {
		display: grid;
		align-items: center;
		grid-template-columns: repeat(3, 1fr);
		grid-auto-rows: minmax(0, 1fr);
	}

	[id$='-evolution-triggers'] {
		display: grid;
		align-items: center;
		grid-auto-rows: minmax(0, 1fr);
		grid-auto-flow: row;
	}

	[id$='-evolution-stage'] [id$='-stage-prev'] {
		height: 1em;
		color: var(--background-color-___);
		border: 1px solid var(--text-color);
		background-color: var(--background-color-___);
	}

	[id$='-evolution-stage'] [id$='-stage-prev'] {
		border-radius: 0 var(--border-r-200) var(--border-r-200) 0;
	}

	[id$='-evolution-stage'] [id$='-stage-pokemon'],
	[id$='-evolution-stage'] [id$='-prevs'],
	[id$='-evolution-stage'] [id$='-nexts'] {
		display: grid;
		align-items: center;
		height: 100%;
		grid-template-columns: 1fr;
		grid-auto-rows: minmax(0, 1fr);
		grid-auto-flow: row;
		justify-content: center;
	}

	[id$='-evolution-stage'] [id$='-prevs'] {
		grid-column: 1;
	}

	[id$='-evolution-stage'] [id$='-stage-pokemon'] {
		grid-column: 2;
	}

	[id$='-evolution-stage'] [id$='-stage-pokemon'] img {
		box-shadow: var(--box-shadow);
		border-radius: var(--border-r-100);
		margin-inline: 0.5em;
	}

	[id$='-evolution-stage'] [id$='-nexts'] {
		grid-column: 3;
	}

	span {
		display: flex;
		place-content: center;
		place-items: center;
		width: 100%;
	}

	@media (max-width: 640px) {
		[id^='evolution'] {
			grid-auto-flow: row;
			grid-auto-rows: minmax(1em, 1fr);

			border-radius: 0;
		}
	}
</style>
