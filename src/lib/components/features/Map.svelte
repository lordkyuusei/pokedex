<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import {
		DEFAULT_MAP_CONFIG,
		DEFAULT_MAP_OPTIONS,
		getMapConfig,
		getMapName,
		type MapConfiguration,
		type MapOptions
	} from '$lib/constants/mapsConfig';
	import { version } from '$lib/store/generation';
	import { MAP_BASE_NAME } from '$lib/constants/locations';
	import type { LocationWithCoords } from '$lib/types/location';
	import { findMatchingMaps } from '$lib/functions/getGamesMaps';

	export let coordinates: LocationWithCoords[] = [];
	export const mapOptions: MapOptions = DEFAULT_MAP_OPTIONS;

	const dispatch = createEventDispatcher();

	let svgRef: SVGElement;
	let maps: string[] = [];
	let selectedMap: string | null = null;
	let selectedMapName: string | null = null;
	let selectedMapConfig: MapConfiguration = DEFAULT_MAP_CONFIG;

	$: if ($version) loadMaps();
	$: if (selectedMap) {
		const mapName = selectedMapName === MAP_BASE_NAME && maps.length > 1 ? selectedMap : $version;
		selectedMapConfig = getMapConfig(mapName);
	}

	const loadMaps = () => {
		maps = findMatchingMaps($version);
		selectedMap = maps[0] ?? $version;
		selectedMapName = getMapName(selectedMap);
	};

	$: coordsAsPoints = coordinates.map(({ name, mapName, coords }) => ({
		id: name,
		map: mapName,
		points: coords
			.reduce((acc, coord, index) => `${acc}${index % 2 === 0 ? `${coord},` : `${coord} `}`, '')
			.slice(0, -1)
	}));

	$: coordsMatchMap = coordsAsPoints.some((coords) => coords.map === selectedMapName);

	$: notFound = coordinates.length === 0 || !coordsMatchMap;

	const changeLocalMap = (newSelectedMap: string) => {
		selectedMap = newSelectedMap;
		selectedMapName = getMapName(selectedMap);
	};

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

<section id="map-{selectedMapName}">
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
		viewBox="0 0 {selectedMapConfig.viewBoxX} {selectedMapConfig.viewBoxY}"
	>
		<image class:not-found={notFound} href="/maps/{selectedMap}.png"></image>
		{#if notFound}
			<text x="15%" y="50%">ZONE INCONNUE</text>
		{:else}
			{#each coordsAsPoints as { points, map, id }, i}
				<polygon
					role="button"
					class:blink={mapOptions.blinkEnabled}
					class:show={map === selectedMapName}
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
	{#if maps.length > 1}
		<aside id="location-submaps">
			<ul>
				{#each maps as map, i (map)}
					{@const localMapName = getMapName(map)}
					{@const mapHasCoords = coordsAsPoints.some((coords) => coords.map === localMapName)}
					<li>
						<button
							class:selected={map === selectedMap}
							class:map-with-coords={mapHasCoords}
							on:click={() => changeLocalMap(map)}
						>
							{localMapName}
						</button>
					</li>
				{/each}
			</ul>
		</aside>
	{/if}
</section>

<style>
	section {
		display: grid;
		grid-template: 1fr / auto 1fr;

		height: 100%;
		overflow-x: auto;
		border-radius: var(--border-r-50);

		& > aside#location-actions,
		& > aside#location-submaps {
			position: sticky;
			left: calc(var(--margin));
			height: fit-content;
			margin: calc(var(--margin)) 0 0 var(--margin);

			& ul {
				display: flex;
				flex-direction: column;
				gap: 1rem;

				& button {
					pointer-events: all;
				}
			}
		}

		& > aside#location-actions {
			display: grid;
			grid-area: 1 / 1 / 1 / 1;
			top: calc(var(--margin));
			width: calc(100% - var(--margin));
			z-index: 2;
			pointer-events: none;
		}

		& > aside#location-submaps {
			top: calc(100% - var(--margin) * 3);
			grid-area: 1 / 1 / 1 / 1;

			& > ul {
				flex-direction: row;
			}
		}

		& > svg {
			grid-area: 1 / 1 / -1 / -1;

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

	.selected {
		color: var(--background-color);
		background-color: var(--second-color);
	}

	.map-with-coords {
		color: var(--background-color);
		background-color: var(--accent-color);
	}

	image {
		width: 100%;
		image-rendering: pixelated;

		transition: filter var(--transition-duration) var(--transition-function);

		&.not-found {
			filter: brightness(0.6) blur(0.5px);
		}
	}

	text {
		stroke: var(--background-color);
		stroke-width: 0.25px;
		fill: var(--text-color);
		box-shadow: var(--box-shadow);
	}

	polygon {
		display: none;
		stroke-linejoin: round;
		stroke: var(--text-color);
		fill: var(--accent-color);
		opacity: 1;
		cursor: pointer;

		&.blink {
			animation: blink 1s cubic-bezier(1, 0, 0, 1) infinite;
		}

		&.show {
			display: block;
		}
	}
</style>
