<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getGamesMaps } from '$lib/functions/getGamesMaps';
	import { saveStatus } from '$lib/store/save';

	import { DEFAULT_MAP_COORDINATES, MAPS_CONFIG } from '$lib/constants/mapsConfig';

	export let coordinates: number[] = [];
	export let version: string = 'red-blue-yellow-green';

	const MAPS_NAMES = getGamesMaps();

	let copyButton: HTMLButtonElement;
	let pasteButton: HTMLButtonElement;
	let forceRectangle: boolean = true;
	let circleHintRef: SVGCircleElement;
	let dispatch = createEventDispatcher();

	$: coordinates = coordinates.length > 0 ? coordinates : DEFAULT_MAP_COORDINATES;
	$: mapName = MAPS_NAMES.find((map) => map.includes(version)) || version;
	$: mapConfig = MAPS_CONFIG[mapName];

	$: coordsAsPoints = coordinates
		.reduce((acc, coord, index) => {
			return `${acc}${index % 2 === 0 ? `${coord},` : `${coord} `}`;
		}, '')
		.slice(0, -1);

	const copyCoordsToClipboard = async () => {
		navigator.clipboard.writeText(coordsAsPoints).then(() => {
			copyButton.textContent = 'Copied 🗺️';
			setTimeout(() => (copyButton.textContent = 'Copy coords'), 1500);
		});
	};

	const pasteCoordsFromClipboard = async () => {
		navigator.clipboard.readText().then((coordsFromClipBoard) => {
			const coords = coordsFromClipBoard
				.split(' ')
				.flatMap((pair) => pair.split(','))
				.map((coord) => parseInt(coord));
			coordinates = coords;

			pasteButton.textContent = 'Pasted 🗺️';
			setTimeout(() => (pasteButton.textContent = 'Paste coords'), 1500);
		});
	};

	/* 0   1   2   3   4   5   6   7
	 * TLX TLY TRX TRY BRX BRY BLX BLY
	 * Top left => Top right => Bot right => Bot left
	 * X => Y
	 *
	 * Mapping in square shape
	 * 0 => 6; 1 => 3; 2 => 4; 3 => 1; 4 => 2; 5 => 7; 6 => 0; 7 => 5;
	 */
	const getMatchingPairsFromIndex = (index: number) =>
		[
			[0, 6],
			[1, 3],
			[2, 4],
			[3, 1],
			[4, 2],
			[5, 7],
			[6, 0],
			[7, 5]
		].find((pair) => pair[0] === index) || [0, 0];

	const updatePair = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (!forceRectangle) return;

		const { id } = event.currentTarget;
		const index = parseInt(id.split('_')[1]);
		const [updated, toUpdate] = getMatchingPairsFromIndex(index);
		coordinates[toUpdate] = coordinates[updated];

		const circleHintX = index % 2 === 0 ? index : index - 1;
		const circleHintY = circleHintX + 1;
		circleHintRef.setAttribute('cx', coordinates[circleHintX].toString());
		circleHintRef.setAttribute('cy', coordinates[circleHintY].toString());

		coordinates = coordinates;
	};

	const triggerUpdate = (event: WheelEvent & { currentTarget: EventTarget & HTMLInputElement }) => {
		const { deltaY } = event;

		const newValue = (parseInt(event.currentTarget.value) + (deltaY < 0 ? 4 : -4)).toString();
		event.currentTarget.value = newValue;
		event.currentTarget.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
	};

	const panZoom = (event: MouseEvent & { currentTarget: EventTarget & SVGSVGElement }) => {
		const { clientHeight, clientWidth } = event.currentTarget;

		const xValue = Math.ceil((100 * event.offsetX) / clientWidth);
		const yValue = Math.ceil((100 * event.offsetY) / clientHeight);

		event.currentTarget.style.setProperty('--x', xValue + '%');
		event.currentTarget.style.setProperty('--y', yValue + '%');
	};

	const changeZoom = (event: WheelEvent & { currentTarget: EventTarget & SVGSVGElement }) => {
		const [MAX_ZOOM, MIN_ZOOM] = [10, 1];

		const isZoomingIn = event.deltaY < 0;
		const currentZoomLevel = parseInt(
			event.currentTarget.style.getPropertyValue('--zoom') || MIN_ZOOM
		);
		const nextZoomLevel = (
			isZoomingIn
				? Math.min(MAX_ZOOM, currentZoomLevel + 1)
				: Math.max(currentZoomLevel - 1, MIN_ZOOM)
		).toString();
		event.currentTarget.style.setProperty('--zoom', nextZoomLevel);
	};
</script>

<section class:span-map={mapName === 'gold-silver-crystal'}>
	<svg
		role="img"
		viewBox="0 0 {mapConfig.viewBoxX} {mapConfig.viewBoxY}"
		on:mousemove={panZoom}
		on:wheel={changeZoom}
	>
		<image href="/maps/{mapName}.png"></image>
		<polygon id="victory-road" points={coordsAsPoints}></polygon>
		<circle bind:this={circleHintRef} r="2"></circle>
	</svg>
	<div class="range-grid">
		{#each coordinates as coord, i}
			{@const isX = i % 2 === 0}
			{@const point = Math.floor((i / 4) * 2 + 1)}
			{@const column = ((point - 1) % 2) + 1}
			{@const headingRow = Math.floor(i / 4) * 3 + 1}
			{@const row = isX ? headingRow + 1 : headingRow + 2}

			{#if i % 4 === 0}
				<div class="heading" style="grid-area: {headingRow} / 1 / {headingRow} / span 2">
					<h1>Point N°{point}</h1>
					<h1>Point N°{point + 1}</h1>
				</div>
			{/if}
			<div class="values" style="grid-area: {row} / {column}">
				<label for="point_{i}">{isX ? 'X:' : 'Y:'}{coord}</label>
				<input
					id="point_{i}"
					type="range"
					step={mapConfig.step}
					min="0"
					max={isX ? mapConfig.viewBoxX : mapConfig.viewBoxY}
					bind:value={coord}
					on:input={updatePair}
					on:wheel|stopPropagation|preventDefault={triggerUpdate}
				/>
			</div>
		{/each}
	</div>
	<div class="actions-grid">
		<input type="checkbox" id="forceRectangle" bind:checked={forceRectangle} />
		<label for="forceRectangle">Force rectangle</label>
		<div class="grid-coords">
			<button on:click={() => (coordinates = [...coordinates, 100, 100])}>Add a corner</button>
			<button on:click={() => (coordinates = coordinates.slice(0, -2))}>Remove last corner</button>
		</div>
		<button bind:this={copyButton} on:click={copyCoordsToClipboard}>Copy coords</button>
		<button bind:this={pasteButton} on:click={pasteCoordsFromClipboard}>Paste coords</button>
		<button on:click={() => dispatch('coords', coordinates)}
			>{$saveStatus.status} coordinates</button
		>
	</div>
</section>

<style>
	section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: repeat(10, auto);
		gap: 1rem;
		padding: var(--small-gap);

		&.span-map {
			grid-template-rows: repeat(2, auto);
		}

		& > svg {
			grid-area: 1 / 1 / -1 / 1;
			--zoom: 3;
			--x: 50%;
			--y: 50%;
			transform-origin: var(--x) var(--y);

			&:hover {
				transform: scale(var(--zoom));
				clip-path: inset(
					calc((1 - 1 / var(--zoom)) * (var(--y))) calc((1 - 1 / var(--zoom)) * (100% - var(--x)))
						calc((1 - 1 / var(--zoom)) * (100% - var(--y))) calc((1 - 1 / var(--zoom)) * (var(--x)))
				);
				cursor: crosshair;
			}
		}

		&.span-map > svg {
			grid-area: 1 / 1 / 1 / -1;
		}
	}

	.range-grid {
		display: grid;
		align-items: center;
		grid-template-columns: 1fr 1fr;
		grid-auto-rows: 2rem;
		column-gap: var(--small-gap);

		& > .heading {
			display: flex;
			justify-content: space-around;
		}

		& > .values {
			display: grid;
			grid-template-columns: minmax(auto, 3rem) 1fr;
		}

		& > h1 {
			text-align: center;
			grid-column: span 2;
			margin: 0;
		}

		& > label {
			text-align: end;
		}
	}

	.actions-grid {
		display: grid;
		grid-template: repeat(3, auto) / auto 1fr;
		align-items: center;
		row-gap: var(--small-gap);

		& > .grid-coords {
			display: grid;
			grid-column: span 2;
			grid-template-columns: 1fr 1fr;
			gap: var(--small-gap);
		}
		& > button {
			grid-column: span 2;
			&:last-of-type {
				background-color: var(--secondary-color);
			}
		}
	}

	image {
		width: 100%;
		image-rendering: pixelated;
	}

	polygon,
	circle {
		fill: var(--secondary-color);
		opacity: 0.75;
		cursor: pointer;
		animation: blink 0.75s cubic-bezier(1, 0, 0, 1) infinite;
	}

	circle {
		fill: var(--primary-color);
	}

	@keyframes blink {
		50% {
			fill: var(--secondary-color);
			opacity: 0.6;
		}
	}
</style>
