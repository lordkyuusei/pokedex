<script lang="ts">
	import { t } from '$lib/store/i18n/i18n';
	import PokemonStat from './PokemonStat.svelte';
	import type { StatRef } from '$lib/types/Pokemon';
	import Card from '$lib/components/barebone/Card.svelte';
	import type { PokemonNatureLight } from '$lib/types/PokemonNature';
	import POKEMON_NATURES from '$lib/store/natures';

	export let statistics: StatRef[] = [];

	let evs: number = 252;
	let ivs: number = 31;
	let lvl: number = 100;
	let nature: PokemonNatureLight;
	let averageStat: StatRef = { base_stat: 1, effort: 0, stat: { name: 'average', url: '' } };

	const assignEVs = (event: Event) => (evs = (event.target as HTMLInputElement).valueAsNumber);
	const assignIVs = (event: Event) => (ivs = (event.target as HTMLInputElement).valueAsNumber);
	const assignLVL = (event: Event) => (lvl = (event.target as HTMLInputElement).valueAsNumber);

	$: averageStat = {
		base_stat:
			Math.floor(
				statistics?.map((stat) => stat.base_stat).reduce((prev, next) => prev + next, 0) /
					statistics?.length
			) || 1,
		effort: 0,
		stat: { name: 'average', url: '' }
	};
</script>

<Card title={$t('title.stats')} close_up>
	<div class="pokemon-stats">
		{#each statistics as stat}
			<PokemonStat {stat} {evs} {ivs} {lvl} {nature} />
		{/each}

		<PokemonStat stat={averageStat} />
		<div class="stats-cursors">
			<select class="stats-nature" bind:value={nature} title="nature">
				{#each POKEMON_NATURES as _nature}
					<option value={_nature}
						>{$t(`nature.${_nature.name}`).padEnd(7, '\xa0')} (➕{_nature.inc_short} ➖{_nature.dec_short})</option
					>
				{/each}
			</select>
			<div class="stats-ranges">
				<div class="stats-iel">
					<input
						class="iel-slider"
						title="EVs"
						type="range"
						step="4"
						min="0"
						max="252"
						value={evs}
						on:input={assignEVs}
					/>
					<div class="iel-value">
						{evs}<br /><abbr title="Effort Values">EVs</abbr>
					</div>
				</div>
				<div class="stats-iel">
					<input
						class="iel-slider"
						title="IVs"
						type="range"
						min="0"
						max="31"
						value={ivs}
						on:input={assignIVs}
					/>
					<div class="iel-value">
						{ivs}<br /><abbr title="Individual Values">IVs</abbr>
					</div>
				</div>
				<div class="stats-iel">
					<input
						class="iel-slider"
						title="LVL"
						type="range"
						min="1"
						max="100"
						value={lvl}
						on:input={assignLVL}
					/>
					<div class="iel-value">
						{lvl}<br /><abbr title="Level">LVL</abbr>
					</div>
				</div>
			</div>
		</div>
	</div>
</Card>

<style>
	.pokemon-stats {
		display: grid;
		grid-template-columns: repeat(10, 10%);
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
		gap: 0.5em;
		width: 100%;
		height: 100%;
		align-items: center;
		grid-column: 8 / 11;
	}

	.stats-nature {
		font: inherit;
		border-radius: 5px;
		width: calc(100% - 1rem);
		color: var(--theme-text);
		background-color: var(--theme-background);
	}

	.stats-ranges {
		display: flex;
		width: 100%;
		height: 100%;
		max-height: calc(100% - 2em);
		justify-content: space-evenly;
	}

	.stats-iel {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		border-radius: 5px;
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

	@media screen and (max-width: 425px) {
		.pokemon-stats {
			grid-template-columns: repeat(7, 15%);
			grid-template-rows: 70% 30%;
			row-gap: 1em;
		}

		.stats-cursors {
			grid-column: 1 / 8;
			grid-row: 2;
			width: 100%;
		}

		.stats-ranges {
			flex-direction: column;
			width: calc(100% - 1rem);
		}

		.stats-iel {
			flex-direction: row;
		}

		.iel-slider {
			width: 75%;
			writing-mode: horizontal-tb;
			-webkit-appearance: slider-horizontal;
		}

		.iel-value {
			width: 25%;
			flex-direction: row;
			justify-content: space-evenly;
		}
	}
</style>
