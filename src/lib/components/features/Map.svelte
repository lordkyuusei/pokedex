<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { getGamesMaps } from '$lib/functions/getGamesMaps';
	import { DEFAULT_MAP_OPTIONS, getMapConfig, type MapOptions } from '$lib/constants/mapsConfig';
	import type { LocationWithCoords } from '$lib/types/location';

	export let pkmnCoordinates: LocationWithCoords[] = [];
	export let version: string = 'red-blue-yellow-green';
	export let mapOptions: MapOptions = DEFAULT_MAP_OPTIONS;

	const MAPS_NAMES = getGamesMaps();

	let svgRef: SVGElement;

	let dispatch = createEventDispatcher();

	$: mapName = MAPS_NAMES.find((map) => map.name.includes(version))?.name || version;
	$: console.log(mapName)
	$: mapConfig = getMapConfig(mapName);
	$: coordsAsPoints = pkmnCoordinates.map(({ name, coords }) => ({
		id: name,
		points: coords
			.reduce((acc, coord, index) => `${acc}${index % 2 === 0 ? `${coord},` : `${coord} `}`, '')
			.slice(0, -1)
	}));

	const panZoom = (event: MouseEvent & { currentTarget: EventTarget & SVGSVGElement }) => {
		const { clientHeight, clientWidth } = event.currentTarget;

		const xValue = Math.ceil((100 * event.offsetX) / clientWidth);
		const yValue = Math.ceil((100 * event.offsetY) / clientHeight);

		event.currentTarget.style.setProperty('--x', xValue + '%');
		event.currentTarget.style.setProperty('--y', yValue + '%');
	};

	const zoomIn = () => {
		const [MAX_ZOOM, MIN_ZOOM] = [10, 1];

		const currentZoomLevel = parseInt(
			svgRef.style.getPropertyValue('--zoom') || MIN_ZOOM.toString()
		);

		svgRef.style.setProperty('--zoom', Math.min(MAX_ZOOM, currentZoomLevel + 1).toString());
	};

	const zoomOut = () => {
		const [MAX_ZOOM, MIN_ZOOM] = [10, 1];

		const currentZoomLevel = parseInt(
			svgRef.style.getPropertyValue('--zoom') || MIN_ZOOM.toString()
		);

		svgRef.style.setProperty('--zoom', Math.max(currentZoomLevel - 1, MIN_ZOOM).toString());
	};

	const setSelectedArea = (id: string) => dispatch('onAreaSelected', id);

	const changeMeasure = () => {
		const isHeight = mapOptions.forceMeasure === 'height';
		mapOptions.forceMeasure = isHeight ? 'width' : 'height';
	};

	function showHintPanel(event: MouseEvent & { currentTarget: EventTarget & SVGPolygonElement }) {}

	function showHintPanelFocus(event: any) {}
</script>

<section id="map-{mapName}">
	<aside id="location-actions">
		<ul>
			<li>
				<button
					class="round"
					title="Blink"
					on:click={() => (mapOptions.blinkEnabled = !mapOptions.blinkEnabled)}>🟥</button
				>
			</li>
			<li>
				<button class="round" title="zoomIn" on:click={() => zoomIn()}>🔍</button>
			</li>
			<li>
				<button class="round" title="zoomOut" on:click={() => zoomOut()}>🔍</button>
			</li>
			<li>
				<button class="round" title="widen" on:click={() => changeMeasure()}>
					{#if mapOptions.forceMeasure === 'width'}
						↕️
					{:else}
						↔️
					{/if}
				</button>
			</li>
		</ul>
	</aside>
	<svg
		role="img"
		on:mousemove={panZoom}
		bind:this={svgRef}
		class:fullWidth={mapOptions.forceMeasure === 'width'}
		viewBox="0 0 {mapConfig.viewBoxX} {mapConfig.viewBoxY}"
	>
		<image class:darken={pkmnCoordinates.length === 0} href="/maps/{mapName}.png"> </image>
		{#if pkmnCoordinates.length === 0}
			<text x="15%" y="50%">ZONE INCONNUE</text>
		{:else}
			{#each coordsAsPoints as { points, id }, i}
				<polygon
					role="button"
					class:blink={mapOptions.blinkEnabled}
					tabindex={i}
					id="zone-{id}"
					{points}
					on:click={() => setSelectedArea(id)}
					on:keyup={() => setSelectedArea(id)}
					on:mouseover={showHintPanel}
					on:focus={showHintPanelFocus}
				></polygon>
			{/each}
		{/if}
	</svg>
</section>

<style>
	section {
		display: grid;
		grid-template: 100% / auto 1fr;

		height: 100%;
		overflow-x: auto;
		border-radius: var(--border-r-50);

		& > aside#location-actions {
			position: sticky;
			top: calc(var(--margin) / 1);
			grid-area: 1 / 1 / 1 / 1;
			display: grid;
			align-items: top;
			height: min-content;
			width: calc(100% - var(--margin));
			margin: calc(var(--margin)) 0 0 var(--margin);
			z-index: 2;
			pointer-events: none;

			& ul {
				display: flex;
				flex-direction: column;
				gap: 1rem;

				& button {
					pointer-events: all;
				}
			}
		}

		& > svg {
			grid-area: 1 / 1 / 1 / span 2;

			--zoom: 1;
			--x: 50%;
			--y: 50%;
			transform-origin: var(--x) var(--y);

			&.fullWidth {
				width: 100%;
			}

			&:not(.fullWidth) {
				height: 100%;
			}

			&:hover {
				transform: scale(var(--zoom));
				clip-path: inset(
					calc((1 - 1 / var(--zoom)) * (var(--y))) calc((1 - 1 / var(--zoom)) * (100% - var(--x)))
						calc((1 - 1 / var(--zoom)) * (100% - var(--y))) calc((1 - 1 / var(--zoom)) * (var(--x)))
				);
				cursor: crosshair;
			}
		}
	}

	image {
		width: 100%;
		image-rendering: pixelated;

		&.darken {
			opacity: 0.5;
		}
	}

	text {
		stroke: var(--background-color);
		stroke-width: 0.25px;
		fill: var(--text-color);
		box-shadow: var(--box-shadow);
	}

	polygon {
		stroke-linejoin: round;
		stroke: hsl(0, 75%, 85%);
		fill: hsl(0, 75%, 65%);
		opacity: 1;
		cursor: pointer;

		&.blink {
			animation: blink 1s cubic-bezier(1, 0, 0, 1) infinite;
		}
	}
</style>
