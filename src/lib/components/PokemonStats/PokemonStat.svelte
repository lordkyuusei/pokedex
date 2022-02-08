<script lang="ts">
	import type { StatRef } from '$lib/types/Pokemon';
	import { getStatColor, getStatHeight } from '$lib/getStylesFromStat';
	import { HPFormula, StatFormula } from '$lib/getStatFromFormula';
	import type { PokemonNatureLight } from '$lib/store/natures';

	export let stat: StatRef = { base_stat: 0, effort: 0, stat: { name: '', url: '' } };
	export let evs: number = 252;
	export let ivs: number = 31;
	export let lvl: number = 100;
	export let nature: PokemonNatureLight = {
		name: 'Hardy',
		increase: '',
		decrease: ''
	};

	$: formula = stat.stat.name === 'hp' ? HPFormula : StatFormula;
	$: statHeight = getStatHeight(stat.base_stat);
	$: statColor = getStatColor(stat.base_stat);
	$: statShade = 'rgba(127, 127, 127, 0.2)';
	$: modifyer = getModifyer(nature);
	$: maxStatValue = formula(stat.base_stat, lvl, evs, ivs, modifyer);

	const getModifyer = (nature: PokemonNatureLight) =>
		nature.increase === stat.stat.name ? 1.1 : nature.decrease === stat.stat.name ? 0.9 : 1;

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
	<div class="stat-result" class:isLowered={modifyer === 0.9} class:isUpped={modifyer === 1.1}>
		{#if stat.stat.name === 'average'}
			&nbsp;
		{:else}
			{maxStatValue}
		{/if}
	</div>
	<div class="stat-jauge-container" style={`background-color: ${statShade}`}>
		<div class="stat-jauge" style={`height: ${statHeight}; background-color: ${statColor};`}>
			{#if stat.effort}
				+{stat.effort} EV
			{/if}
		</div>
	</div>
	<div class="stat-value">
		{stat.base_stat}<br />
		{statToIcon[stat.stat.name]}
	</div>
</div>

<style>
	.pokemon-stat {
		width: calc(100% - 1rem);
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
		width: 100%;
		text-align: center;
		font-size: 0.5rem;
		border-radius: 5px;
		transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
	}

	.stat-result {
		flex: 1;
	}

	.isLowered {
		color: var(--theme-secondary);
		font-weight: bold;
	}

	.isUpped {
		color: var(--theme-primary);
		font-weight: bold;
	}
</style>
