<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	import type {
		EvolutionChain,
		EvolutionUnit,
		PokemonEvolution
	} from '$lib/types/pokeapi/evolution';
	import { navigatePokemon } from '$lib/functions/navigate';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';

	import Trigger from './Trigger.svelte';
	import OneWay from './OneWay.svelte';
	import TwoWays from './TwoWays.svelte';
	import ThreeWays from './ThreeWays.svelte';
	import EeveeWays from './EeveeWays.svelte';

	export let evolution: PokemonEvolution;

	const mapSizeToComponent = {
		'1': OneWay,
		'2': TwoWays,
		'3': ThreeWays,
		'8': EeveeWays
	};

	let pokemonId: number = 0;
	let pokemonStages = new Map<number, EvolutionUnit[]>();

	$: if (evolution && evolution.id) updateOnIdChange(evolution.id);

	const updateOnIdChange = (id: number) => {
		pokemonId = id;
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
			<div id="{level}-evolution-triggers" in:fade={{ delay: i * 100 }}>
				{#each evolutionUnits as unit, i (unit.name)}
					<Trigger {unit} size={evolutionUnits.length} />
				{/each}
			</div>
		{/if}

		<!-- Affichage du/des Pokémon & des avant/après-->
		<div id="{pokemonId}-{level}-evolution-stage">
			{#if level > 1}
				<div id="{level}-{i}-prevs" in:fade={{ delay: i * 100 }}>
					{#each evolutionUnits as _, i}
						<span id="{level}-{i}-stage-prev" />
					{/each}
				</div>
			{/if}
			<div id="{level}-stage-pokemon" in:fade={{ delay: i * 100 }}>
				{#each evolutionUnits as unit, i (unit.name)}
					<a href={navigatePokemon(unit.name, $page)}>
						<img src={fetchPokemonSpriteURL(Number(unit.name))} alt={unit.name} />
					</a>
				{/each}
			</div>
			{#if level < pokemonStages.size}
				<div id="{level}-{i}-nexts" in:fade={{ delay: i * 100 }}>
					{#each evolutionUnits as unit, i}
						<svelte:component this={mapSizeToComponent[pokemonStages.get(level + 1)?.length]} />
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</section>

<style>
	section[id^='evolution'] {
		display: grid;
		height: 100%;
		width: 100%;

		overflow-y: auto;
		grid-auto-flow: column;
		grid-auto-columns: minmax(1em, 1fr);

		border-radius: var(--border-r-50);
		background-color: var(--background-second-color);
		box-shadow: var(--box-shadow);

		&[id$='2'] {
			grid-template-columns: 1fr 2fr 1fr;
		}

		& > [id$='-evolution-stage'] {
			display: grid;
			align-items: center;
			grid-template-columns: repeat(3, 1fr);
			grid-auto-rows: minmax(0, 1fr);
			gap: var(--small-gap);

			& span[id$='-stage-prev'] {
				height: 1em;
				color: var(--text-color);
				background-color: var(--text-color);
			}

			& span[id$='-stage-prev'] {
				border-radius: 0 var(--border-r-200) var(--border-r-200) 0;
			}

			& > [id$='-stage-pokemon'],
			& > [id$='-prevs'],
			& > [id$='-nexts'] {
				display: grid;
				align-items: center;
				height: 100%;
				grid-template-columns: 1fr;
				grid-auto-rows: minmax(0, 1fr);
				grid-auto-flow: row;
				justify-content: center;
			}

			& > [id$='-prevs'] {
				grid-column: 1;
			}

			& > [id$='-stage-pokemon'] {
				grid-column: 2;
			}

			& > [id$='-stage-pokemon'] a {
				box-shadow: var(--box-shadow);
				border-radius: var(--border-r-50);
			}

			& > [id$='-stage-pokemon'] img {
				margin-inline: 0.5em;
			}

			& > [id$='-nexts'] {
				grid-column: 3;
			}

			& span {
				display: flex;
				place-content: center;
				place-items: center;
				width: 100%;
			}
		}

		& > [id$='-evolution-triggers'] {
			display: grid;
			align-items: center;
			grid-auto-rows: minmax(0, 1fr);
			grid-auto-flow: row;
		}
	}

	@media (max-width: 640px) {
		[id^='evolution'] {
			grid-auto-rows: 1fr;
			grid-auto-columns: 40%;
			border-radius: 0;
		}
	}
</style>
