<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import {
		DEFAULT_MAP_CONFIG,
		getDefaultCoordinates,
		getMapConfig,
		getMapName,
		type MapConfiguration
	} from '$lib/constants/mapsConfig';
	import { saveStatus } from '$lib/store/save';
	import { version } from '$lib/store/generation';
	import { MAP_BASE_NAME } from '$lib/constants/locations';
	import { findMatchingMaps } from '$lib/functions/getGamesMaps';

	export let coordinates: number[] = [];
	export let coordMap: string | null = null;
	export let mapI18Names: { fr: string, en: string };

	let maps: string[] = [];
	let selectedMap: string | null = coordMap;
	let selectedMapName: string | null = null;
	let selectedMapConfig: MapConfiguration = DEFAULT_MAP_CONFIG;

	let mapDialog: HTMLDialogElement;
	let copyButton: HTMLButtonElement;
	let pasteButton: HTMLButtonElement;
	let forceRectangle: boolean = true;
	let moveWithKeyboard: boolean = false;

	const dispatch = createEventDispatcher();

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

	$: coordinates = coordinates.length > 0 ? coordinates : getDefaultCoordinates(selectedMapConfig);
	$: coordsAsPoints = coordinates
		.reduce((acc, coord, i) => `${acc}${i % 2 === 0 ? `${coord},` : `${coord} `}`, '')
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
		const { style } = event.currentTarget;

		const isZoomingIn = event.deltaY < 0;
		const currentZoomLevel = parseInt(style.getPropertyValue('--zoom') || MIN_ZOOM.toString());
		const nextZoomLevel = (
			isZoomingIn
				? Math.min(MAX_ZOOM, currentZoomLevel + 1)
				: Math.max(currentZoomLevel - 1, MIN_ZOOM)
		).toString();
		style.setProperty('--zoom', nextZoomLevel);
	};

	const dispatchNewCoords = () => dispatch('coords', { coordinates, selectedMap: selectedMapName });

	const changeLocalMap = (newSelectedMap: string) => {
		selectedMap = newSelectedMap;
		selectedMapName = getMapName(selectedMap);
	};

	const showCoordinatesOnMap = (selected: string | null, map: string | null = null) => {
		const isMapSelected = selected === map;
		const isNoMapYet = map === null;
		const isBaseSelected = selectedMapName === MAP_BASE_NAME && coordMap === MAP_BASE_NAME;

		console.log({isMapSelected, isNoMapYet, isBaseSelected, selected, map})
		return isMapSelected || isNoMapYet || isBaseSelected;
	};

	const getDetails = (index: number) => {
		const isAbscissa = index % 2 === 0;
		const pointNbr = Math.floor((index / 4) * 2) + 1;
		const gridColumn = ((pointNbr - 1) % 2) + 1;
		const headerGridRow = Math.floor(index / 4) * 3 + 1;
		const valuesGridRow = headerGridRow + (isAbscissa ? 1 : 2);

		return {
			isAbscissa,
			pointNbr,
			gridColumn,
			headerGridRow,
			valuesGridRow
		};
	};

	const movePolygonWithKeyboard = (event: KeyboardEvent) => {
		if (!moveWithKeyboard) return;

		const { key, ctrlKey } = event;
		const boost = ctrlKey ? 10 : 1;

		coordinates = coordinates.map((value, idx) => [
				{ c: key === 'ArrowLeft' && idx % 2 === 0, f: value - boost },
				{ c: key === 'ArrowUp' && idx % 2 !== 0, f: value - boost },
				{ c: key === 'ArrowRight' && idx % 2 === 0, f: value + boost },
				{ c: key === 'ArrowDown' && idx % 2 !== 0, f: value + boost },
			].find(x => x.c)?.f ?? value
		);
	}

	const showLocationOnMap = async (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) => {
		const parser = new DOMParser();

		const page = await fetch(`/api/pokepedia?name=${mapI18Names.fr}`);
		if (!page.ok) return;

		const pageSource = await page.text();
		const pageHtml = parser.parseFromString(pageSource, 'text/html');
		const informationSheetRows: NodeListOf<HTMLTableRowElement> = pageHtml.querySelectorAll('.ficheinfo > tbody > tr');
		const mapTitle = informationSheetRows.values().find(x => x.textContent && x.textContent.includes("Localisation"));
		if (!mapTitle) return;

		// <tr>Localisation</tr> => <tr><td><span><a></span></td></tr>
		const mapWrapper = mapTitle.nextElementSibling?.firstElementChild?.firstElementChild?.firstElementChild;
		if (!mapWrapper) return;

		const url = new URL((mapWrapper as HTMLAnchorElement).href);
		
		const mapPage = await fetch(`/api/pokepedia?name=${url.pathname.substring(1)}`);
		if (!mapPage.ok) return;

		const mapPageSource = await mapPage.text();
		const mapPageHtml = parser.parseFromString(mapPageSource, 'text/html');
		const img: HTMLImageElement | null = mapPageHtml.querySelector('#file.fullImageLink > a > img');
		if (!img) return;

		const imgUrl = new URL(img.src);
		img.src = `https://www.pokepedia.fr${imgUrl.pathname}`;
		mapDialog.appendChild(img);
		mapDialog.showModal();
	}

	const hideLocationOnMap = (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) => {
		const img = mapDialog.querySelector('img');
		if (img) {
			mapDialog.removeChild(img);
		}
		mapDialog.close();
	}
</script>

<svelte:window on:keydown={movePolygonWithKeyboard}></svelte:window>

<dialog bind:this={mapDialog}>
	<button class="round" on:click={hideLocationOnMap}>X</button>
</dialog>

<section class:span-map={selectedMap === 'gold-silver-crystal'}>
	<svg
		role="img"
		viewBox="0 0 {selectedMapConfig.viewBoxX} {selectedMapConfig.viewBoxY}"
		on:mousemove={panZoom}
		on:wheel={changeZoom}
	>
		<image href="/maps/{selectedMap}.png"></image>
		{#if showCoordinatesOnMap(selectedMapName, coordMap)}
			<polygon
				id="victory-road"
				points={coordsAsPoints}
			>
			</polygon>
		{/if}
	</svg>
	{#if maps.length > 1}
		<aside class="maps-list">
			<ul>
				{#each maps as map, i (map)}
					{@const localMapName = getMapName(map)}
					<li>
						<button
							class:selected={map === selectedMap}
							class:map-with-coords={localMapName === coordMap}
							on:click={() => changeLocalMap(map)}
						>
							{localMapName}
						</button>
					</li>
				{/each}
			</ul>
		</aside>
	{/if}
	<div class="range-grid">
		{#each coordinates as coord, i}
			{@const helper = getDetails(i)}

			{#if i % 4 === 0}
				<div
					class="heading"
					style="grid-area: {helper.headerGridRow} / 1 / {helper.headerGridRow} / span 2"
				>
					<h1>Point N°{helper.pointNbr}</h1>
					<h1>Point N°{helper.pointNbr + 1}</h1>
				</div>
			{/if}
			<div class="values" style="grid-area: {helper.valuesGridRow} / {helper.gridColumn}">
				<label for="point_{i}">{helper.isAbscissa ? 'X' : 'Y'}: {coord}</label>
				<input
					id="point_{i}"
					type="range"
					step={selectedMapConfig.step}
					min="0"
					max={helper.isAbscissa ? selectedMapConfig.viewBoxX : selectedMapConfig.viewBoxY}
					bind:value={coord}
					on:input={updatePair}
					on:wheel|stopPropagation|preventDefault={triggerUpdate}
				/>
			</div>
		{/each}
	</div>
	<div class="actions-grid">
		<div class="grid-toggles">
			<input type="checkbox" id="forceRectangle" bind:checked={forceRectangle} />
			<label for="forceRectangle">Force rectangle</label>
			<input type="checkbox" id="moveWithKeyboard" bind:checked={moveWithKeyboard} />
			<label for="moveWithKeyboard">Move with ⬆️⬇️⬅️➡️</label>
		</div>
		<div class="grid-coords">
			<button on:click={() => (coordinates = [...coordinates, 100, 100])}>Add a corner</button>
			<button on:click={() => (coordinates = coordinates.slice(0, -2))}>Remove last corner</button>
		</div>
		<button on:click={showLocationOnMap}>See on map</button>
		<button bind:this={copyButton} on:click={copyCoordsToClipboard}>Copy coords</button>
		<button bind:this={pasteButton} on:click={pasteCoordsFromClipboard}>Paste coords</button>
		<button on:click={() => dispatchNewCoords()}>{$saveStatus.status} coordinates</button>
	</div>
</section>

<style>
	dialog {
		position: relative;
		overflow: initial;
		z-index: 2;
		
		transition: display var(--transition-duration) var(--transition-function);
		transition-behavior: allow-discrete;

		& > button {
			position: absolute;
			top: -1rem;
			right: -1rem;
			z-index: 3;
		}

		& > img {
			width: 60svw;
			height: 100%;
			image-rendering: pixelated;
		}

		&::backdrop {
			background: var(--background-blur-second-color);
		}
	}

	section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: repeat(5, auto);
		gap: 1rem;
		padding: var(--small-gap);

		&.span-map {
			grid-template-rows: repeat(2, auto);
		}

		& > aside {
			margin-top: auto;
			grid-area: 2 / 1 / -1 / 1;
			& > ul {
				display: flex;
				gap: var(--small-gap);
			}
		}

		& > svg {
			grid-area: 1 / 1 / -1 / 1;
			--zoom: 1;
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
		max-height: calc(50svh - var(--small-gap));
		overflow-y: auto;

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

	.selected {
		background-color: var(--second-color);
	}

	.map-with-coords {
		background-color: var(--accent-color);
	}

	image {
		width: 100%;
		image-rendering: pixelated;
	}

	polygon {
		stroke-linejoin: round;
		stroke: hsl(0, 75%, 85%);
		fill: hsl(0, 75%, 65%);
		opacity: 1;
		cursor: pointer;
		animation: blink calc(var(--transition-duration) * 10) var(--transition-function) infinite;
	}
</style>
