<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getGamesMaps } from '$lib/functions/getGamesMaps';
	const MAPS_NAMES = getGamesMaps();

	export let topRightX: number = 75;
	export let topRightY: number = 75;
	export let topLeftX: number = 50;
	export let topLeftY: number = 75;
	export let botLeftX: number = 50;
	export let botLeftY: number = 225;
	export let botRightX: number = 75;
	export let botRightY: number = 225;
	export let version: string = 'red-blue-yellow-green';

	$: mapName = MAPS_NAMES.find((map) => map.includes(version));

	let dispatch = createEventDispatcher();
</script>

<section>
	<svg viewBox="0 0 500 500">
		<image href="/maps/{mapName}.png"></image>
		<polygon
			id="victory-road"
			points="{topLeftX},{topLeftY} {topRightX},{topRightY} {botRightX},{botRightY} {botLeftX},{botLeftY}"
		></polygon>
	</svg>
	<div class="range-grid">
		<h1>Top Left</h1>
		<h1>Top Right</h1>
		<label for="top-left-x">X: {topLeftX}</label>
		<input name="top-left-x" type="range" step="5" min="0" max="500" bind:value={topLeftX} />
		<label for="top-left-y">Y: {topLeftY}</label>
		<input name="top-left-y" type="range" step="5" min="0" max="500" bind:value={topLeftY} />
		<label for="top-right-x">X: {topRightX}</label>
		<input name="top-right-x" type="range" step="5" min="0" max="500" bind:value={topRightX} />
		<label for="top-right-y">Y: {topRightY}</label>
		<input name="top-right-y" type="range" step="5" min="0" max="500" bind:value={topRightY} />
		<h1>Bot Left</h1>
		<h1>Bot Right</h1>
		<label for="bot-left-x">X: {botLeftX}</label>
		<input name="bot-left-x" type="range" step="5" min="0" max="500" bind:value={botLeftX} />
		<label for="bot-left-y">Y: {botLeftY}</label>
		<input name="bot-left-y" type="range" step="5" min="0" max="500" bind:value={botLeftY} />
		<label for="bot-right-x">X: {botRightX}</label>
		<input name="bot-right-x" type="range" step="5" min="0" max="500" bind:value={botRightX} />
		<label for="bot-right-y">Y: {botRightY}</label>
		<input name="bot-right-y" type="range" step="5" min="0" max="500" bind:value={botRightY} />
	</div>
	<button
		on:click={() =>
			dispatch('coords', [
				topLeftX,
				topLeftY,
				topRightX,
				topRightY,
				botRightX,
				botRightY,
				botLeftX,
				botLeftY
			])}>Save coordinates</button
	>
</section>

<style>
	section {
		display: grid;
		grid-template: auto auto / 1fr 1fr;
		gap: 1rem;
		padding: var(--small-gap);

		& > svg {
			grid-area: span 2 / 1;
		}

		& > button {
			grid-area: 2 / 2;
		}
	}

	.range-grid {
		display: grid;
		align-items: center;
		grid-template-columns: auto 1fr auto 1fr;
		grid-auto-rows: 2rem;
		column-gap: var(--smallest-gap);

		& > h1 {
			text-align: center;
			grid-column: span 2;
			margin: 0;
		}

		& > label {
			text-align: end;
		}
	}

	image {
		width: 100%;
		image-rendering: pixelated;
	}

	polygon {
		fill: rgba(151, 0, 0, 0.3);
		cursor: pointer;
		animation: blink 1s cubic-bezier(0.075, 0.82, 0.165, 1) infinite;
	}

	@keyframes blink {
		50% {
			fill: rgb(255 255 255 / 0.3);
		}
	}
</style>
