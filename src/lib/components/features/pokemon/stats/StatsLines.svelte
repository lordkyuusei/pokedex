<script lang="ts">
	import type { StatRef } from '$lib/types/pokeapi/pokemon';

	export let stats: StatRef[] = [];

	const mapKeyToStat: { [x: string]: string } = {
		hp: 'Hp',
		attack: 'Atk',
		defense: 'Def',
		'special-attack': 'Sp.Atk',
		'special-defense': 'Sp.Def',
		speed: 'Spe'
	};

	$: baseStats = stats.map((s) => ({
		name: mapKeyToStat[s.stat.name],
		effort: s.effort,
		value: s.base_stat
	}));

	$: totalStat = baseStats.reduce((prev, next) => prev + next.value, 0);
	$: highStat = Math.max(...baseStats.map((x) => x.value));
	$: baseScale = highStat / 8;
	$: scaleStats = [1, 3, 5, 7].reduce(
		(acc, next) => [...acc, (baseScale * next).toFixed(0)],
		[] as string[]
	);
</script>

<header id="statistics-scale">
	{#each scaleStats as stat}
		<span>{stat}</span>
	{/each}
</header>
<span id="statistics-total">
	{totalStat}
</span>
<aside id="statistics-name">
	{#each baseStats as stat}
		<span>{stat.name}</span>
	{/each}
</aside>
<section id="statistics-stats">
	{#each baseStats as stat}
		<meter
			id="stat-{stat.name}"
			min="0"
			max={highStat}
			low={(1 / 3) * highStat}
			high={(2 / 3) * highStat}
			optimum={(2.5 / 3) * highStat}
			value={stat.value}
			data-effort={stat.effort > 0 ? `+${stat.effort} EV` : undefined}
		/>
	{/each}
</section>
<section id="statistics-lines">
	{#each scaleStats as stat}
		<hr />
	{/each}
</section>
<aside id="statistics-base">
	{#each baseStats as stat}
		<span>{stat.value}</span>
	{/each}
</aside>

<style>
	#statistics-base {
		grid-area: base;
	}

	#statistics-name {
		grid-area: name;
	}

	#statistics-stats,
	#statistics-lines {
		grid-area: graph;
	}

	#statistics-scale {
		grid-area: scale;
	}

	#statistics-total {
		grid-area: total;
		color: var(--primary-color);
		font-weight: bolder;
	}

	#statistics-base,
	#statistics-name,
	#statistics-stats {
		display: grid;
		grid-template: repeat(6, 1fr) / 100%;
		width: 100%;
		height: 100%;
	}

	#statistics-base span,
	#statistics-name span,
	#statistics-scale span {
		display: flex;
		place-content: center;
		place-items: center;
		font-weight: bolder;
	}

	#statistics-stats meter {
		width: 100%;
		height: 100%;
		position: relative;
	}

	#statistics-stats meter::after {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: 4px;
		content: attr(data-effort);
		color: var(--background-color);
	}

	#statistics-stats meter::-webkit-meter-bar {
		transition: all 0.2s ease-in-out;
		border-radius: 0px var(--border-r-100) var(--border-r-100) 0;
	}

	#statistics-stats meter::-webkit-meter-optimum-value {
		transition: all 0.2s ease-in-out;
	}

	#statistics-scale,
	#statistics-lines {
		display: grid;
		grid-template: 100% / repeat(4, 1fr);
		color: var(--background-accent);
		width: 100%;
		height: 100%;
	}

	#statistics-lines hr {
		width: 0;
		border: 1px dashed var(--background-accent);
		height: 95%;
	}
</style>
