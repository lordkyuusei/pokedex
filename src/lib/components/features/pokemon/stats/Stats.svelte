<script lang="ts">
	import { fade } from 'svelte/transition';
	import Switch from '$lib/components/common/Switch.svelte';
	import type { StatRef } from '$lib/types/pokeapi/pokemon';
	import StatsCalculator from './StatsCalculator.svelte';
	import StatsLines from './StatsLines.svelte';

	export let stats: StatRef[];

	let toggleStrat: boolean = false;
</script>

<section in:fade={{ delay: 100 }} id="stats-statistics" class:toggled={toggleStrat}>
	<div id="statistics-switch">
		<Switch event="strat" icon="training" on:strat={(e) => (toggleStrat = e.detail.strat)} />
	</div>
	{#if !toggleStrat}
		<StatsLines {stats} />
	{:else}
		<StatsCalculator {stats} />
	{/if}
</section>

<style>
	#stats-statistics {
		display: grid;
		place-items: center;
		padding: 1em;
		border-radius: var(--border-r-200) var(--border-r-50) var(--border-r-200) 0;
		background-color: var(--background-color);
		box-shadow: var(--box-shadow);
	}

	@media (max-width: 414px) {
		#stats-statistics {
			border-radius: 0;
			box-shadow: none;
		}
	}

	#stats-statistics:not(.toggled) {
		grid-template:
			'switch scale total' 1fr
			'name graph base' 5fr / 1fr 4fr 1fr;
	}

	.toggled {
		grid-template:
			'switch graph' 1fr
			'modifiers graph' 5fr
			'help graph' 1fr / 1fr 5fr;
	}

	#statistics-switch {
		grid-area: switch;
	}
</style>
