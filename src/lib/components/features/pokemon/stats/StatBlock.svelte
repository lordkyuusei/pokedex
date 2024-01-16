<script lang="ts">
	import {
		MAX_STAT,
		POLYGON_MAX_COORDINATES,
		mapKeyToStat,
		mapPolygonCoordinatesToString
	} from '$lib/constants/stats';
	import type { StatRef } from '$lib/types/pokeapi/pokemon';
	import { afterUpdate } from 'svelte';

	export let stats: StatRef[] = [];

	$: baseStats = stats
		.map((s) => ({
			name: mapKeyToStat[s.stat.name].name,
			code: s.stat.name,
			effort: s.effort,
			value: s.base_stat
		}))
		.sort((a, z) => mapKeyToStat[a.code].order - mapKeyToStat[z.code].order);

	let statsCoordinates: number[][] = [];
	let bigPoly: SVGPolygonElement;
	let smallPoly: SVGPolygonElement;

	$: totalStat = baseStats.reduce((prev, next) => prev + next.value, 0);

	const updatePolygonPoint = (value: number, angle: number, isReset = false) => {
		const [maxX, maxY] = [...statsCoordinates[angle]];

		const newValue = value / 2;
		const newAngle = Math.atan2(maxY - MAX_STAT / 2, maxX - MAX_STAT / 2);

		// I have no idea why the -2 solves the alignment but it does???
		const newX = (MAX_STAT - 2) / 2 + newValue * Math.cos(newAngle);
		const newY = (MAX_STAT - 2) / 2 + newValue * Math.sin(newAngle);

		smallPoly.points[angle].x = newX;
		smallPoly.points[angle].y = newY;
	};

	afterUpdate(() => {
		const statsOrder = baseStats.map((stat, i) => ({ index: i, stat }));
		statsCoordinates = statsOrder.map((n) => [
			bigPoly.points[n.index].x,
			bigPoly.points[n.index].y
		]);
		statsOrder.forEach((order) => updatePolygonPoint(order.stat.value, order.index, true));
	});
</script>

<section id="stat-block">
	<svg id="polygon-holder" viewBox="0 0 {MAX_STAT} {MAX_STAT}">
		<polygon
			id="big-poly"
			class="basic-stroke"
			bind:this={bigPoly}
			points={mapPolygonCoordinatesToString(POLYGON_MAX_COORDINATES)}
		/>
		<line x1="126" y1="0" x2="126" y2="252" />
		<line x1="236" y1="65" x2="16" y2="187" />
		<line x1="236" y1="187" x2="16" y2="65" />
		<polygon id="small-poly" bind:this={smallPoly} points="0,0 0,0 0,0 0,0 0,0 0,0" />
	</svg>
	<span id="stat-cumulative">{totalStat}</span>
	{#each baseStats as stat}
		<div id="value-{stat.code}"><span>{stat.name}</span><em>{stat.value}</em></div>
	{/each}
</section>

<style>
	.basic-stroke {
		stroke: var(--text-color);
	}

	#stat-block {
		position: relative;
		height: 100%;
		width: 100%;
		display: grid;
		grid-area: graph;
		place-content: center;
		place-items: center;

		grid-template-rows: 0.3fr 1fr 1fr 0.3fr;
		grid-template-columns: 1fr 3fr 1fr;

		& > svg {
			grid-area: 2 / 2 / 4 / 2;

			& > polygon,
			& > line {
				stroke-width: 1;
				stroke: var(--text-color);

				&#big-poly {
					fill: var(--background-color-_);
				}

				&#small-poly {
					fill: var(--primary-color);
				}
			}
		}

		& > #stat-cumulative {
			grid-area: 2 / 2 / 4 / 2;
			color: var(--background-color-____);
			z-index: 1;
			font-size: x-large;
		}

		& > [id^='value'] {
			display: grid;
			width: 100%;
			grid-template-rows: 1fr 1fr;
			align-items: center;

			& > span {
				color: var(--primary-color);
			}

			& > em {
				color: var(--text-color);
				font-size: larger;
			}
		}

		& > #value-hp,
		& > #value-speed {
			justify-items: center;
		}

		& > #value-attack,
		& > #value-special-attack {
			justify-items: left;
		}

		& > #value-defense,
		& > #value-special-defense {
			justify-items: right;
		}

		& > #value-hp {
			grid-area: 1 / 2 / 1 / 2;
		}
		& > #value-attack {
			grid-area: 2 / 3 / 2 / 3;
		}
		& > #value-special-attack {
			grid-area: 3 / 3 / 3 / 3;
		}
		& > #value-special-defense {
			grid-area: 3 / 1 / 3 / 1;
		}
		& > #value-defense {
			grid-area: 2 / 1 / 2 / 1;
		}
		& > #value-speed {
			grid-area: 4 / 2 / 4 / 2;
		}
	}
</style>
