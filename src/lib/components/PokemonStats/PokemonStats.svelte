<script lang="ts">
	import type { StatRef } from '$lib/types/Pokemon';
	import Card from '$lib/components/PokemonLayouts/Card.svelte';
	import PokemonStat from './PokemonStat.svelte';
	import { beforeUpdate } from 'svelte';
	import POKEMON_NATURES, { PokemonNatureLight } from '$lib/store/natures';

	export let statistics: StatRef[] = [];

	let evs: number = 252;
	let ivs: number = 31;
	let lvl: number = 100;
	let nature: PokemonNatureLight;
	let averageStat: StatRef = { base_stat: 1, effort: 0, stat: { name: 'average', url: '' } };

	beforeUpdate(() => {
		averageStat = {
			base_stat: Math.floor(
				statistics?.map((stat) => stat.base_stat).reduce((prev, next) => prev + next) /
					statistics?.length
			),
			effort: 0,
			stat: { name: 'average', url: '' }
		};
	});
</script>

<Card scp>
	<div class="pokemon-stats">
		{#each statistics as stat}
			<PokemonStat {stat} {evs} {ivs} {lvl} {nature} />
		{/each}

		<PokemonStat stat={averageStat} />
		<div class="stats-cursors">
			<select class="stats-nature" bind:value={nature} title="nature">
				{#each POKEMON_NATURES as nature}
					<option value={nature}>{nature.name}</option>
				{/each}
			</select>
			<div class="stats-ranges">
				<div class="stats-iel">
					<div class="iel-value">
						{evs}
						{'EVs'}
					</div>
					<input
						class="iel-slider"
						title="EVs"
						type="range"
						step="4"
						min="0"
						max="252"
						value={evs}
						on:input={(event) => (evs = event.target.valueAsNumber)}
					/>
				</div>
				<div class="stats-iel">
					<div class="iel-value">
						{ivs}
						{'IVs'}
					</div>
					<input
						class="iel-slider"
						title="IVs"
						type="range"
						min="0"
						max="31"
						value={ivs}
						on:input={(event) => (ivs = event.target.valueAsNumber)}
					/>
				</div>
				<div class="stats-iel">
					<div class="iel-value">
						{lvl}
						{'LVL'}
					</div>
					<input
						class="iel-slider"
						title="LVL"
						type="range"
						min="1"
						max="100"
						value={lvl}
						on:input={(event) => (lvl = event.target.valueAsNumber)}
					/>
				</div>
			</div>
		</div>
	</div>
</Card>

<style>
	.pokemon-stats {
		display: grid;
		grid-template-columns: repeat(10, 2.5em);
		grid-template-rows: 100%;
		justify-content: center;
		align-items: center;
		justify-items: center;
		align-content: stretch;
		height: 100%;
		width: 100%;
	}

	.stats-cursors {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		align-items: center;
		grid-column: 8 / 11;
	}

	.stats-nature {
		margin-bottom: 0.5rem;
		background-color: var(--theme-background);
		color: var(--theme-text);
		border-radius: 5px;
		width: calc(100% - 1rem);
	}

	.stats-ranges {
		display: flex;
		height: 100%;
	}

	.stats-iel {
		width: 30px;
		height: 100%;
		border-radius: 5px;
		position: relative;
		display: flex;
		flex-direction: column-reverse;
		align-items: center;
	}

	.iel-value {
		width: 100%;
		text-align: center;
		display: flex;
		flex-direction: column;
		z-index: 1;
	}

	.iel-slider {
		width: 100%;
		height: 100%;
		border-radius: 5px;
		writing-mode: vertical-rl;
		-webkit-appearance: slider-vertical;
	}
</style>
