<script lang="ts">
	import { fetchPokemonEvolutionChain } from '$lib/api';
	import type {
		EvolutionChain,
		PokemonEvolution,
		EvolutionUnit
	} from '$lib/types/PokemonEvolutionChain';
	import { t } from '$lib/store/i18n/i18n';

	import Card from '$lib/components/barebone/Card.svelte';
	import StraightLine from './PokemonEvolutionChains/StraightLine.svelte';
	import DoubleStraightLine from './PokemonEvolutionChains/DoubleStraightLine.svelte';
	import PokemonLink from './PokemonEvolutionChains/PokemonLink.svelte';
	import TopStraightBottomLine from './PokemonEvolutionChains/TopStraightBottomLine.svelte';
	import TopCurvyLine from './PokemonEvolutionChains/TopCurvyLine.svelte';
	import BottomCurvyLine from './PokemonEvolutionChains/BottomCurvyLine.svelte';

	const evolutionPattern = {
		'1': ['straight'],
		'2': ['double-straight'],
		'3': ['top-curvy', 'top-straight-bottom', 'bot-curvy'],
		'8': ['top-curvy', ...new Array(6).fill('top-straight-bottom'), 'bot-curvy']
	};

	const evolutionOptions = [
		{ name: 'straight', component: StraightLine },
		{ name: 'double-straight', component: DoubleStraightLine },
		{ name: 'top-straight-bottom', component: TopStraightBottomLine },
		{ name: 'top-curvy', component: TopCurvyLine },
		{ name: 'bot-curvy', component: BottomCurvyLine }
	];

	export let evolutionChain: { url: string };
	let pokemonStages = new Map<number, EvolutionUnit[]>();

	$: fetchEvolutionChain(evolutionChain);

	$: computedWidth = [
		{ cond: pokemonStages.size === 1, value: 'sm' },
		{ cond: pokemonStages.size === 2, value: 'md' },
		{ cond: true, value: 'lg' }
	].find(({ cond }) => cond).value;

	$: computedHeight = [
		{ cond: pokemonStages.get(2)?.length === 1, value: 'sm' },
		{ cond: pokemonStages.get(2)?.length === 2, value: 'md' },
		{ cond: pokemonStages.get(2)?.length <= 5, value: 'lg' },
		{ cond: true, value: 'xl' }
	].find(({ cond }) => cond).value;

	const fetchEvolutionChain = (chain: { url: string }) => {
		if (!chain) return;

		pokemonStages.clear();
		const pokemonId = chain.url.match(/\d+/g).at(-1);
		fetchPokemonEvolutionChain(pokemonId).then((evolution: PokemonEvolution) => {
			extractEvolutionChain(evolution.chain);
		});
	};

	const extractEvolutionChain = (chain: EvolutionChain, level: number = 1) => {
		if (!chain) return;

		const { species, evolves_to, evolution_details } = chain;
		if (species && evolves_to.length) {
			const { url } = species;
			const evolutionUnit: EvolutionUnit = {
				name: url.match(/\d+/g).pop(),
				trigger: evolution_details
			};
			pokemonStages.set(level, [...(pokemonStages.get(level) || []), evolutionUnit]);
			evolves_to.forEach((evolutionUnit) => extractEvolutionChain(evolutionUnit, level + 1));
		} else {
			const addition = [
				...(pokemonStages.get(level) || []),
				{ name: species.url.match(/\d+/g).pop(), trigger: evolution_details }
			];
			pokemonStages = new Map([...pokemonStages, [level, addition]]);
			return;
		}
	};
</script>

<Card title={$t('title.evolution-chain')} close_up>
	<div class="pokemon-evolution-chain">
		{#each [...pokemonStages] as [stage, evolutionChain]}
			<div class="evolution-chain-stage">
				{#if stage !== 1}
					<div class="chain-stage-trigger">
						{#each evolutionPattern[evolutionChain.length] as chainType, index}
							<svelte:component
								this={evolutionOptions.find((opt) => opt.name === chainType).component}
								props={{ triggers: evolutionChain[index].trigger }}
							/>
						{/each}
					</div>
				{/if}
				<div class="chain-stage-specie">
					{#each evolutionChain as chain}
						<PokemonLink pokemon={chain.name} {stage} maxStage={pokemonStages.size} />
					{/each}
				</div>
			</div>
		{/each}
	</div>
</Card>

<style>
	.pokemon-evolution-chain {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		overflow-y: auto;
	}

	.evolution-chain-stage {
		display: flex;
		flex-direction: row;
		width: 100%;
		flex: 2;
	}

	.evolution-chain-stage:is(:first-child) {
		flex: 1;
	}

	.chain-stage-trigger {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
	}
	.chain-stage-specie {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
	}

	@media (max-width: 768px) {
		.pokemon-evolution-chain {
			justify-content: flex-start;
		}
	}
</style>
