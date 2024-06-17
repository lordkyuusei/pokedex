<script lang="ts">
	import { fade } from 'svelte/transition';
	import Switch from '$lib/components/common/Switch.svelte';
	import type { StatRef } from '$lib/types/pokeapi/pokemon';
	import StatsCalculator from './StatsCalculator.svelte';
	import StatBlock from './StatBlock.svelte';

	export let stats: StatRef[];

	let toggleStrat: boolean = false;
</script>

<section in:fade={{ delay: 100 }} id="stats-statistics" class:toggled={toggleStrat}>
	<div id="statistics-switch">
		<Switch event="strat" icon="training" on:strat={(e) => (toggleStrat = e.detail.strat)} />
	</div>
	{#if !toggleStrat}
		<StatBlock {stats} />
	{:else}
		<StatsCalculator {stats} />
	{/if}
</section>

<style>
	#stats-statistics {
		position: relative;
		display: grid;
		place-items: center;
		padding: var(--small-gap);
		box-shadow: var(--box-shadow);
		background-color: var(--background-second-color);
		border-radius: var(--border-r-200) var(--border-r-50) var(--border-r-200) 0;
	}

	@media (max-width: 640px) {
		#stats-statistics {
			border-radius: 0;
			box-shadow: none;
		}
	}

	#statistics-switch {
		position: absolute;
		top: 1.5rem;
		left: var(--normal-gap);
	}

	#stats-statistics {
		grid-template: 'graph' 100% / 100%;
	}

	#statistics-switch {
		grid-area: switch;
	}
</style>
