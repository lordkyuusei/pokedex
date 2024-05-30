<script lang="ts">
	import { onMount } from 'svelte';

	import {
		MAX_CUMULATIVE_EVS,
		MAX_CUMULATIVE_STATS_POINTS_GEN1,
		MAX_CUMULATIVE_STATS_POINTS_GEN2,
		MAX_DV_PER_STAT,
		MAX_EV_PER_STAT,
		MAX_IV_PER_STAT,
		MAX_STATS_POINTS_PER_STAT,
		OLD_POLYGON_MAX_COORDINATES,
		POLYGON_MAX_COORDINATES,
		mapPolygonCoordinatesToString
	} from '$lib/constants/stats';
	import { generation } from '$lib/store/generation';
	import Switch from '$lib/components/common/Switch.svelte';
	import type { StatRef } from '$lib/types/pokeapi/pokemon';
	import { HPFormula, StatFormula } from '$lib/functions/statFormula';

	export let stats: StatRef[] = [];

	let evPv: number = 0;
	let evAtk: number = 0;
	let evDef: number = 0;
	let evAtkSpe: number = 0;
	let evDefSpe: number = 0;
	let evSpe: number = 0;

	let lvl: number = 50;
	let ivs: boolean = false;
	let natures: number[] = [1, 1, 1, 1, 1];

	let statsCoordinates: number[][] = [];

	const resetStatsOnGenerationChange = (_: number) => {
		evPv = 0;
		evAtk = 0;
		evDef = 0;
		evAtkSpe = 0;
		evDefSpe = 0;
		evSpe = 0;

		statsCoordinates = config$.polygonMaxCoordinates;
		[0, 1, 2, 3, 4, 5].forEach((order) => updatePolygonPoint(0, order, true));
	};

	const updateConfigOnGenerationChange = (id: number) => ({
		isGen1: id === 1,
		isGen2: id === 2,
		isOldGen: id < 3,
		defaultSize: id < 3 ? MAX_STATS_POINTS_PER_STAT : MAX_EV_PER_STAT,
		polygonMaxCoordinates: id < 3 ? OLD_POLYGON_MAX_COORDINATES : POLYGON_MAX_COORDINATES,
		maxCumulEv:
			id === 1
				? MAX_CUMULATIVE_STATS_POINTS_GEN1
				: id === 2
					? MAX_CUMULATIVE_STATS_POINTS_GEN2
					: MAX_CUMULATIVE_EVS
	});

	$: config$ = updateConfigOnGenerationChange($generation.id);
	$: resetStatsOnGenerationChange($generation.id);

	$: EV = evPv + evAtk + evDef + evAtkSpe + evDefSpe + evSpe;
	$: IV = ivs === false ? 0 : config$.isOldGen ? MAX_DV_PER_STAT : MAX_IV_PER_STAT;
	$: HP = HPFormula(stats[0].base_stat, lvl, evPv, IV, config$.isOldGen);
	$: ATK = StatFormula(stats[1].base_stat, lvl, evAtk, IV, natures[0], config$.isOldGen);
	$: ATKSPE = StatFormula(stats[2].base_stat, lvl, evAtkSpe, IV, natures[1], config$.isOldGen);
	$: SPE = StatFormula(stats[3].base_stat, lvl, evSpe, IV, natures[2], config$.isOldGen);
	$: DEFSPE = StatFormula(stats[4].base_stat, lvl, evDefSpe, IV, natures[3], config$.isOldGen);
	$: DEF = StatFormula(stats[5].base_stat, lvl, evDef, IV, natures[4], config$.isOldGen);

	const setNature = (stat: number) => {
		const natureCoefficienMap = [
			{ v: natures[stat] === 1, f: (x: number, i: number) => (i === stat ? 1.1 : x) },
			{ v: natures[stat] === 1.1, f: (x: number, i: number) => (i === stat ? 0.9 : x) },
			{ v: natures[stat] === 0.9, f: (x: number, i: number) => (i === stat ? 1 : x) }
		];

		const coeffMap = natureCoefficienMap.find((x) => x.v);
		if (!coeffMap) return;

		natures = natures.map(coeffMap.f);
	};

	const updatePolygonPoint = (value: number, angle: number, isReset = false) => {
		if (EV >= config$.maxCumulEv && !isReset) return;

		const smallPolygon = document.getElementById('small-poly') as unknown as SVGPolygonElement;
		if (!smallPolygon) return;

		const [maxX, maxY] = [...statsCoordinates[angle]];

		const newValue = value / 2;
		const newAngle = Math.atan2(maxY - config$.defaultSize / 2, maxX - config$.defaultSize / 2);

		const newX = (config$.defaultSize - 2) / 2 + newValue * Math.cos(newAngle);
		const newY = (config$.defaultSize - 2) / 2 + newValue * Math.sin(newAngle);

		smallPolygon.points[angle].x = newX;
		smallPolygon.points[angle].y = newY;
	};

	onMount(() => {
		const statsOrder = [0, 1, 2, 3, 4, 5];
		const hexagon = document.getElementById('big-poly') as unknown as SVGPolygonElement;
		statsCoordinates = statsOrder.map((n) => [hexagon.points[n].x, hexagon.points[n].y]);
		statsOrder.forEach((order) => updatePolygonPoint(0, order, true));
	});
</script>

<section id="stats-calculator" style="grid-area: graph">
	<aside id="stats-modifiers">
		<label for="lvl">Niveau</label>
		<input style="width: 100%" type="number" bind:value={lvl} min="1" max="100" />
		<label for="ivs">{config$.isOldGen ? 'DV à 15' : 'IV à 31'}</label>
		<Switch event="ivs" icon="training" on:ivs={(e) => (ivs = e.detail.ivs)} />
	</aside>
	<div id="calculator-ui">
		<svg id="polygon-holder" viewBox="0 0 {config$.defaultSize} {config$.defaultSize}">
			<polygon
				id="big-poly"
				class="basic-stroke"
				points={mapPolygonCoordinatesToString(config$.polygonMaxCoordinates)}
			/>
			<polygon id="small-poly" points="0,0 0,0, 0,0 0,0 0,0 0,0" />
		</svg>
		<input
			id="slider-ev-pv"
			type="range"
			min="0"
			max={config$.defaultSize}
			step="4"
			value={evPv}
			data-value={evPv}
			on:input={(event) => {
				const { valueAsNumber: value } = event.currentTarget;
				if (value > evPv && EV - evPv + value > config$.maxCumulEv) {
					event.currentTarget.value = evPv.toString();
					return;
				}
				evPv = value;
				updatePolygonPoint(evPv, 0);
			}}
		/>
		<input
			id="slider-ev-atk"
			type="range"
			min="0"
			max={config$.defaultSize}
			step="4"
			value={evAtk}
			data-value={evAtk}
			on:input={(event) => {
				const { valueAsNumber: value } = event.currentTarget;
				if (value > evAtk && EV - evAtk + value > config$.maxCumulEv) {
					event.currentTarget.value = evAtk.toString();
					return;
				}
				evAtk = value;
				updatePolygonPoint(evAtk, 1);
			}}
		/>
		<input
			id="slider-ev-speatk"
			type="range"
			min="0"
			max={config$.defaultSize}
			step="4"
			value={evAtkSpe}
			data-value={evAtkSpe}
			on:input={(event) => {
				const { valueAsNumber: value } = event.currentTarget;
				if (value > evAtkSpe && EV - evAtkSpe + value > config$.maxCumulEv) {
					event.currentTarget.value = evAtkSpe.toString();
					return;
				}
				evAtkSpe = value;
				updatePolygonPoint(evAtkSpe, 2);
			}}
		/>
		<input
			id="slider-ev-spe"
			type="range"
			min="0"
			max={config$.defaultSize}
			step="4"
			value={evSpe}
			data-value={evSpe}
			on:input={(event) => {
				const { valueAsNumber: value } = event.currentTarget;
				if (value > evSpe && EV - evSpe + value > config$.maxCumulEv) {
					event.currentTarget.value = evSpe.toString();
					return;
				}
				evSpe = value;
				updatePolygonPoint(evSpe, 3);
			}}
		/>
		<input
			id="slider-ev-spedef"
			type="range"
			min="0"
			max={config$.defaultSize}
			step="4"
			value={evDefSpe}
			data-value={evDefSpe}
			on:input={(event) => {
				const { valueAsNumber: value } = event.currentTarget;
				if (value > evDefSpe && EV - evDefSpe + value > config$.maxCumulEv) {
					event.currentTarget.value = evDefSpe.toString();
					return;
				}
				evDefSpe = value;
				updatePolygonPoint(evDefSpe, 4);
			}}
		/>
		<input
			id="slider-ev-def"
			type="range"
			min="0"
			max={config$.defaultSize}
			step="4"
			value={evDef}
			data-value={evDef}
			on:input={(event) => {
				const { valueAsNumber: value } = event.currentTarget;
				if (value > evDef && EV - evDef + value > config$.maxCumulEv) {
					event.currentTarget.value = evDef.toString();
					return;
				}
				evDef = value;
				updatePolygonPoint(evDef, 5);
			}}
		/>
		<button id="value-ev-pv"><span>P.V.</span><em>{HP}</em></button>
		<button
			id="value-ev-atk"
			class:minus={natures[0] === 0.9}
			class:major={natures[0] === 1.1}
			on:click={() => setNature(0)}><span>Attaque</span><em>{ATK}</em></button
		>
		<button
			id="value-ev-atkspe"
			class:minus={natures[1] === 0.9}
			class:major={natures[1] === 1.1}
			on:click={() => setNature(1)}><span>Att. Spé.</span><em>{ATKSPE}</em></button
		>
		<button
			id="value-ev-spe"
			class:minus={natures[2] === 0.9}
			class:major={natures[2] === 1.1}
			on:click={() => setNature(2)}><span>Vitesse</span><em>{SPE}</em></button
		>
		<button
			id="value-ev-defspe"
			class:minus={natures[3] === 0.9}
			class:major={natures[3] === 1.1}
			on:click={() => setNature(3)}><span>Déf. Spé.</span><em>{DEFSPE}</em></button
		>
		<button
			id="value-ev-def"
			class:minus={natures[4] === 0.9}
			class:major={natures[4] === 1.1}
			on:click={() => setNature(4)}><span>Défense</span><em>{DEF}</em></button
		>
	</div>
</section>

<style>
	.basic-stroke {
		stroke: var(--text-color);
	}

	.minus {
		color: var(--secondary-color);
	}

	.major {
		color: var(--third-color);
	}

	#stats-calculator {
		position: relative;
		width: 100%;
		aspect-ratio: 1;

		display: grid;
		align-items: center;
		grid-template: 'modifiers calculator' 100% / min-content auto;

		& > #stats-modifiers {
			grid-area: modifiers;

			height: 100%;
			display: grid;
			align-content: center;
			gap: var(--small-gap);
			padding-inline: var(--small-gap);
		}

		& > #calculator-ui {
			grid-area: calculator;

			display: grid;
			grid-template:
				". pv-text ." 25%
				"def-text graph atk-text" 25%
				"spd-text graph spa-text" 25%
				". spe-text ." 25% / 1fr 3fr 1fr;

			place-items: center;

			& > svg {
				grid-area: graph;

				& > [id$='-poly'] {
					stroke-width: 1;
					stroke: var(--text-color);
				}

				& > #big-poly {
					fill: var(--background-color-_);
				}

				& > #small-poly {
					fill: var(--primary-color);
				}
			}

			& > input[id^='slider'] {
				grid-area: graph;
				height: 1px;
				width: 50%;
				margin: 0;
				padding: 0;
				z-index: 4;
				transform-origin: center;
				background: var(--text-color);

				&#slider-ev-pv {
					transform: rotate(270deg) translateX(50%);
				}

				&#slider-ev-atk {
					transform: rotate(-29deg) translateX(50%);
				}

				&#slider-ev-speatk {
					transform: rotate(29deg) translateX(50%);
				}

				&#slider-ev-spe {
					transform: rotate(90deg) translateX(50%);
				}

				&#slider-ev-spedef {
					transform: rotate(151deg) translateX(50%);
				}

				&#slider-ev-def {
					transform: rotate(209deg) translateX(50%);
				}
			}

			& > button[id^='value'] {
				appearance: none;
				display: grid;
				align-items: center;
				cursor: pointer;

				& > *:not(span) {
					color: var(--primary-color);
				}

				&[id$="-ev-pv"] {
					grid-area: pv-text;
					justify-content: center;
					color: red;
				}

				&[id$="-ev-atk"] {
					grid-area: atk-text;
					justify-items: left;
				}

				&[id$="-ev-atkspe"] {
					grid-area: spa-text;
					justify-items: left;
				}

				&[id$="-ev-spe"] {
					grid-area: spe-text;
					justify-content: center;
				}

				&[id$="-ev-defspe"] {
					grid-area: spd-text;
					justify-items: right;
				}

				&[id$="-ev-def"] {
					grid-area: def-text;
					justify-items: right;
				}


			}
		}
	}
</style>
