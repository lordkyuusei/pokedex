<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getGamesMaps } from '$lib/functions/getGamesMaps';
	import MAPS_CONFIG from '$lib/constants/mapsConfig';

	export let topRightX: number = 75;
	export let topRightY: number = 75;
	export let topLeftX: number = 50;
	export let topLeftY: number = 75;
	export let botLeftX: number = 50;
	export let botLeftY: number = 225;
	export let botRightX: number = 75;
	export let botRightY: number = 225;
	export let version: string = 'red-blue-yellow-green';
	
	let copyButton: HTMLButtonElement;
	let pasteButton: HTMLButtonElement;
	let forceRectangle: boolean = true;

	const MAPS_NAMES = getGamesMaps();
	$: mapName = MAPS_NAMES.find((map) => map.includes(version)) || version;
	$: mapConfig = MAPS_CONFIG[mapName];

	let dispatch = createEventDispatcher();

	const copyCoordsToClipboard = async (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) => {
		navigator.clipboard.writeText(`${topLeftX},${topLeftY} ${topRightX},${topRightY} ${botRightX},${botRightY} ${botLeftX},${botLeftY}`)
			.then(() => {
				copyButton.textContent = "Copied 🗺️";
				setTimeout(() => copyButton.textContent = "Copy coords", 3000);
			})
	}

	const pasteCoordsFromClipboard = async (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) => {
		navigator.clipboard.readText()
		.then((coordsFromClipBoard) => {
				const coords = coordsFromClipBoard.split(' ').flatMap(pair => pair.split(','));
				topLeftX = parseInt(coords[0]);
				topLeftY = parseInt(coords[1]);
				topRightX = parseInt(coords[2]);
				topRightY = parseInt(coords[3]);
				botRightX = parseInt(coords[4]);
				botRightY = parseInt(coords[5]);
				botLeftX = parseInt(coords[6]);
				botLeftY = parseInt(coords[7]);
				pasteButton.textContent = "Pasted 🗺️";
				setTimeout(() => pasteButton.textContent = "Paste coords", 3000);
			})
	}


	const updatePair = (event: Event & { currentTarget: EventTarget & HTMLInputElement; }) => {
		if (!forceRectangle) return;

		const { id } = event.currentTarget;
		console.log(id);
		if (id === 'top-left-x') botLeftX = topLeftX;
		if (id === 'top-left-y') topRightY = topLeftY;
		if (id === 'top-right-x') botRightX = topRightX;
		if (id === 'top-right-y') topLeftY = topRightY;
		if (id === 'bot-right-x') topRightX = botRightX;
		if (id === 'bot-right-y') botLeftY = botRightY;
		if (id === 'bot-left-x') topLeftX = botLeftX;
		if (id === 'bot-left-y') botRightY = botLeftY;
	}
</script>

<section>
	<svg viewBox="0 0 {mapConfig.viewBoxX} {mapConfig.viewBoxY}">
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
		<input id="top-left-x" type="range" step={mapConfig.step} min="0" max={mapConfig.viewBoxX} bind:value={topLeftX} on:input={updatePair}/>
		<label for="top-right-x">X: {topRightX}</label>
		<input id="top-right-x" type="range" step={mapConfig.step} min="0" max={mapConfig.viewBoxX} bind:value={topRightX} on:input={updatePair}/>
		<label for="top-left-y">Y: {topLeftY}</label>
		<input id="top-left-y" type="range" step={mapConfig.step} min="0" max={mapConfig.viewBoxY} bind:value={topLeftY} on:input={updatePair}/>
		<label for="top-right-y">Y: {topRightY}</label>
		<input id="top-right-y" type="range" step={mapConfig.step} min="0" max={mapConfig.viewBoxY} bind:value={topRightY} on:input={updatePair}/>
		<h1>Bot Left</h1>
		<h1>Bot Right</h1>
		<label for="bot-left-x">X: {botLeftX}</label>
		<input id="bot-left-x" type="range" step={mapConfig.step} min="0" max={mapConfig.viewBoxX} bind:value={botLeftX} on:input={updatePair}/>
		<label for="bot-right-x">X: {botRightX}</label>
		<input id="bot-right-x" type="range" step={mapConfig.step} min="0" max={mapConfig.viewBoxX} bind:value={botRightX} on:input={updatePair}/>
		<label for="bot-left-y">Y: {botLeftY}</label>
		<input id="bot-left-y" type="range" step={mapConfig.step} min="0" max={mapConfig.viewBoxY} bind:value={botLeftY} on:input={updatePair}/>
		<label for="bot-right-y">Y: {botRightY}</label>
		<input id="bot-right-y" type="range" step={mapConfig.step} min="0" max={mapConfig.viewBoxY} bind:value={botRightY} on:input={updatePair}/>
	</div>
	<div>
		<input type="checkbox" id="forceRectangle" bind:checked={forceRectangle}>
		<label for="forceRectangle">Force rectangle</label>
	</div>
	<button bind:this={copyButton} on:click={copyCoordsToClipboard}>Copy coords</button>
	<button bind:this={pasteButton} on:click={pasteCoordsFromClipboard}>Paste coords</button>
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
		grid-template-columns: 1fr 1fr;
		grid-template-rows: repeat(10, auto);
		gap: 1rem;
		padding: var(--small-gap);

		& > svg {
			grid-area: 1 / 1 / -1 / 1;
		}

		& > button {
			grid-column: 2;
		}
	}

	.range-grid {
		display: grid;
		align-items: center;
		grid-template-columns: 3rem 1fr 3rem 1fr;
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
		fill: var(--secondary-color);
		opacity: 0.75;
		cursor: pointer;
		animation: blink 0.75s cubic-bezier(1, 0, 0, 1) infinite;
	}

	@keyframes blink {
		50% {
			fill: rgb(255 255 255 / 0.3);
		}
	}
</style>
