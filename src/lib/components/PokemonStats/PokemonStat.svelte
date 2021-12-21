<script lang="ts">
	import type { StatRef } from '$lib/store/types/Pokemon';
	import { getStatColor, getStatHeight } from '$lib/getStylesFromStat';
	import { HPFormula, StatFormula } from '$lib/getStatFromFormula';

	export let stat: StatRef;
	export let evs: number = 252;
	export let ivs: number = 31;
	export let lvl: number = 100;

	$: formula = stat.stat.name === 'hp' ? HPFormula : StatFormula;
	$: statHeight = getStatHeight(stat.base_stat);
	$: statColor = getStatColor(stat.base_stat);
	$: statShade = 'rgba(127, 127, 127, 0.2)';
	$: maxStatValue = formula(stat.base_stat, lvl, evs, ivs);

	const statToIcon = {
		hp: 'HP',
		attack: 'ATK',
		defense: 'DEF',
		'special-attack': 'SPA',
		'special-defense': 'SPD',
		speed: 'SPE',
		average: 'AVG'
	};
</script>

<div class="pokemon-stat">
	<div class="stat-result">
		{#if stat.stat.name === 'average'}
			&nbsp;
		{:else}
			{maxStatValue}
		{/if}
	</div>
	<div class="stat-jauge-container" style={`background-color: ${statShade}`}>
		<div class="stat-jauge" style={`height: ${statHeight}; background-color: ${statColor};`} />
	</div>
	<div class="stat-value">
		{stat.base_stat}
		{statToIcon[stat.stat.name]}
	</div>
</div>

<style scoped>
	.pokemon-stat {
		width: 30px;
		height: 100%;
		border-radius: 5px;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.stat-value {
		width: 100%;
		height: auto;
		text-align: center;
		display: flex;
		flex-direction: column;
		z-index: 1;
	}
	.stat-jauge-container {
		height: 100%;
		width: 100%;
		margin: 5px;
		border-radius: 5px;
		display: flex;
		flex-direction: column-reverse;
	}
	.stat-jauge {
		transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
		width: 100%;
		border-radius: 5px;
	}
	.stat-result {
		flex: 1;
	}
</style>
