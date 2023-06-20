<script lang="ts">
	import { onMount } from 'svelte';

	import type { StatRef } from '$lib/types/pokeapi/pokemon';
	import Switch from '$lib/components/common/Switch.svelte';
	import { HPFormula, StatFormula } from '$lib/functions/statFormula';

	export let stats: StatRef[] = [];

	const defaultSize = 252;

	let statsCoordinates: number[][] = [];

	let evPv: number = 100;
	let evAtk: number = 100;
	let evDef: number = 100;
	let evAtkSpe: number = 100;
	let evDefSpe: number = 100;
	let evSpe: number = 100;
	let lvl: number = 50;
	let ivs: boolean = false;
	let natures: number[] = [1, 1, 1, 1, 1];

	$: IV = ivs === false ? 0 : 31;
	$: HP = HPFormula(stats[0].base_stat, lvl, evPv, IV);
	$: ATK = StatFormula(stats[1].base_stat, lvl, evAtk, IV, natures[0]);
	$: ATKSPE = StatFormula(stats[2].base_stat, lvl, evAtkSpe, IV, natures[1]);
	$: SPE = StatFormula(stats[3].base_stat, lvl, evSpe, IV, natures[2]);
	$: DEFSPE = StatFormula(stats[4].base_stat, lvl, evDefSpe, IV, natures[3]);
	$: DEF = StatFormula(stats[5].base_stat, lvl, evDef, IV, natures[4]);

	const setNature = (stat: number) => {
		if (natures[stat] === 1) {
			natures = natures.map((x, i) => (i === stat ? 1.1 : x));
		} else if (natures[stat] === 1.1) {
			natures = natures.map((x, i) => (i === stat ? 0.9 : x));
		} else {
			natures = natures.map((x, i) => (i === stat ? 1 : x));
		}
	};

	const updatePolygonPoint = (value: number, angle: number) => {
		const smallPoly = document.getElementById('small-poly');
		const currentPointsRaw = smallPoly?.getAttribute('points')?.split(' ') ?? [];
		let currentPoints = currentPointsRaw?.map((points) => points.split(','));

		const [currX, currY] = [...statsCoordinates[angle]];
		const newValue = value / 2;
		const newAngle = Math.atan2(currY - defaultSize / 2, currX - defaultSize / 2);

		const xs = (defaultSize / 2 + newValue * Math.cos(newAngle)).toFixed(0);
		const ys = (defaultSize / 2 + newValue * Math.sin(newAngle)).toFixed(0);

		currentPoints[angle] = [xs, ys];

		smallPoly?.setAttribute('points', currentPoints?.flatMap((x) => x.join(',')).join(' '));
	};

	onMount(() => {
		const hexagon = document.getElementById('big-poly') as unknown as SVGPolygonElement;
		if (hexagon) {
			statsCoordinates = [0, 1, 2, 3, 4, 5].map((n) => [hexagon.points[n].x, hexagon.points[n].y]);
			updatePolygonPoint(100, 0);
			updatePolygonPoint(100, 1);
			updatePolygonPoint(100, 2);
			updatePolygonPoint(100, 3);
			updatePolygonPoint(100, 4);
			updatePolygonPoint(100, 5);
		}
	});
</script>

<aside id="stats-modifiers">
	<label for="lvl">Niveau</label>
	<input style="width: 100%" type="number" bind:value={lvl} min="1" max="100" />
	<label for="ivs">IV à 31</label>
	<Switch event="ivs" icon="training" on:ivs={(e) => (ivs = e.detail.ivs)} />
</aside>
<section id="stats-calculator" style="grid-area: graph">
	<div id="calculator-ui">
		<svg viewBox="0 0 {defaultSize} {defaultSize}">
			<polygon
				id="big-poly"
				class="basic-stroke"
				points="126,0 236,65, 236,187 126,252, 16,187, 16,65"
			/>
			<polygon id="small-poly" />
		</svg>
		<input
			id="slider-ev-pv"
			type="range"
			min="0"
			max="252"
			step="4"
			bind:value={evPv}
			data-value={evPv}
			on:input={(v) => updatePolygonPoint(v.target.valueAsNumber, 0)}
		/>
		<input
			id="slider-ev-atk"
			type="range"
			min="0"
			max="252"
			step="4"
			bind:value={evAtk}
			data-value={evAtk}
			on:input={(v) => updatePolygonPoint(v.target.valueAsNumber, 1)}
		/>
		<input
			id="slider-ev-speatk"
			type="range"
			min="0"
			max="252"
			step="4"
			bind:value={evAtkSpe}
			data-value={evAtkSpe}
			on:input={(v) => updatePolygonPoint(v.target.valueAsNumber, 2)}
		/>
		<input
			id="slider-ev-spe"
			type="range"
			min="0"
			max="252"
			step="4"
			bind:value={evSpe}
			data-value={evSpe}
			on:input={(v) => updatePolygonPoint(v.target.valueAsNumber, 3)}
		/>
		<input
			id="slider-ev-spedef"
			type="range"
			min="0"
			max="252"
			step="4"
			bind:value={evDefSpe}
			data-value={evDefSpe}
			on:input={(v) => updatePolygonPoint(v.target.valueAsNumber, 4)}
		/>
		<input
			id="slider-ev-def"
			type="range"
			min="0"
			max="252"
			step="4"
			bind:value={evDef}
			data-value={evDef}
			on:input={(v) => updatePolygonPoint(v.target.valueAsNumber, 5)}
		/>
	</div>
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
</section>
<div id="statistics-switch">
	<button title="Utilisez les points du graphe pour faire varier les EVs dans chaque statistique."
		>?</button
	>
</div>

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

	#stats-modifiers {
		grid-area: modifiers;
		height: 100%;
		display: grid;
		align-content: center;
		justify-items: center;
		gap: 0.5em;
	}

	#stats-calculator {
		position: relative;
		width: 100%;
		aspect-ratio: 1;

		display: grid;
		place-content: center;
		place-items: center;
	}

	#stats-calculator #calculator-ui,
	#stats-calculator #calculator-ui > svg {
		position: relative;
		height: 100%;
		width: 100%;
	}

	#stats-calculator > #calculator-ui > svg [id$='-poly'] {
		stroke-width: 1;
		stroke: var(--text-color);
	}

	#stats-calculator > #calculator-ui > svg #big-poly {
		fill: var(--background-accent);
	}

	#stats-calculator > #calculator-ui > svg #small-poly {
		fill: var(--primary-color);
	}

	#stats-calculator > #calculator-ui [id^='slider'] {
		position: absolute;
		top: 50%;
		left: 50%;
		height: 1px;
		width: calc(50% - 1px);
		margin: 0;
		padding: 0;
		outline: none;
		appearance: none;
		background: var(--text-color);
		transform-origin: left;
	}

	#stats-calculator > #calculator-ui [id^='slider']::-webkit-slider-thumb {
		appearance: none;
		background-color: var(--background-secondary);
		height: 0.5em;
		border-radius: var(--border-r-50);
		aspect-ratio: 1;
	}

	#stats-calculator > #calculator-ui [id^='slider']::after {
		content: '';
		position: absolute;
		top: calc(50% - 0.12em);
		right: -5%;
		background-color: white;
		height: 0.25em;
		width: 0.25em;
		border-radius: var(--border-r-50);
	}

	#stats-calculator > #calculator-ui [id^='slider']::before {
		content: attr(data-value);
		position: absolute;
		left: calc(50% - 1em);
	}

	#stats-calculator [id^='value'] {
		appearance: none;
		border: none;
		background: none;
		position: absolute;
		display: grid;
		grid-template-rows: 1fr 1fr;
		align-items: center;
		cursor: pointer;
	}

	#stats-calculator [id^='value'] > *:not(span) {
		color: var(--primary-color);
	}

	#stats-calculator #value-ev-pv,
	#stats-calculator #value-ev-spe {
		justify-content: items;
	}

	#stats-calculator #value-ev-atk,
	#stats-calculator #value-ev-atkspe {
		right: -3%;
		justify-items: left;
	}

	#stats-calculator #value-ev-def,
	#stats-calculator #value-ev-defspe {
		left: -3%;
		justify-items: right;
	}

	#stats-calculator #value-ev-pv {
		top: -2.5%;
		left: calc(50% - 1.25em);
	}

	#stats-calculator #value-ev-atk {
		top: 25%;
	}

	#stats-calculator #value-ev-atkspe {
		bottom: 25%;
	}

	#stats-calculator #value-ev-spe {
		bottom: -2.5%;
		left: calc(50% - 2em);
	}

	#stats-calculator #value-ev-defspe {
		bottom: 20%;
	}

	#stats-calculator #value-ev-def {
		top: 20%;
	}

	#slider-ev-pv {
		transform: rotate(270deg);
	}

	#slider-ev-atk {
		transform: rotate(-29deg);
	}

	#slider-ev-speatk {
		transform: rotate(29deg);
	}

	#slider-ev-spe {
		transform: rotate(90deg);
	}

	#slider-ev-spedef {
		transform: rotate(151deg);
	}

	#slider-ev-def {
		transform: rotate(209deg);
	}
</style>
