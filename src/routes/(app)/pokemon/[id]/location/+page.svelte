<svelte:options immutable />

<script lang="ts">
	import { browser } from '$app/environment';
	import { version } from '$lib/store/generation';

	import { DEXAPI_LOCATION } from '$lib/constants/api.json';
	import type { PokemonLocationArea } from '$lib/types/pokeapi/location-area';
	import type { Location, LocationWithCoords, SimplifiedLocation } from '$lib/types/location';

	import Map from '$lib/components/features/Map.svelte';
	import MapLocationDetails from '$lib/components/features/MapLocationDetails.svelte';

	import type { PageData } from './$types';
	import MapLocationFallback from '$lib/components/features/MapLocationFallback.svelte';

	export let data: PageData;

	let selectedArea: LocationWithCoords | null = null;
	let locationsPerGame: SimplifiedLocation[] = [];
	let locationsWithCoords: LocationWithCoords[] = [];

	$: if (browser && $version && data) loadLocations(data.location);
	$: hasLocationsCoords = locationsWithCoords.every((loc) => loc.coords.length !== 0);

	const loadLocations = (locations: PokemonLocationArea[]) => {
		if (locations.length === 0) {
			locationsPerGame = [];
			locationsWithCoords = [];
			return;
		}

		const rawLocations = extractLocations(locations);
		locationsPerGame = rawLocations.filter((game) => $version.includes(game.version));
		if (locationsPerGame.length === 0) {
			locationsWithCoords = [];
			return;
		}

		selectedArea = null;

		fetch(`${DEXAPI_LOCATION}/${$version}`).then(async (response) => {
			const gameLocations: Location = await response.json();
			const flatLocations = gameLocations.regions.flatMap(({ locations }) =>
				locations.flatMap(({ areas, mapName }) => areas.map((x) => ({ ...x, mapName })))
			);

			const mapLocationToCoordinates = locationsPerGame.flatMap(({ locations }) =>
				locations.map((loc) => {
					const name = loc.location;
					const locationCoordinates = flatLocations.find((loc) => loc.name === name);
					if (!locationCoordinates) return null;

					return {
						name,
						mapName: locationCoordinates.mapName,
						i18nName: locationCoordinates.i18nName,
						coords: locationCoordinates.coords,
						conditions: loc.conditions
					};
				})
			);

			locationsWithCoords = mapLocationToCoordinates.filter((loc) => loc !== null);
		});
	};

	const extractLocations = (locations: PokemonLocationArea[]) => {
		const versions = [
			...new Set(
				locations
					.flatMap((location) =>
						location.version_details.map((version) => ({
							id: parseInt(version.version.url.match(/\d+/g)[1]),
							name: version.version.name
						}))
					)
					.sort((a, z) => a.id - z.id)
					.map((location) => location.name)
			)
		];

		const locationsPerVersion = versions.map((version) => {
			const locationsForVersion = locations.filter((location) =>
				location.version_details.some((v) => v.version.name === version)
			);
			return {
				version: version,
				locations: locationsForVersion.map((location) => {
					const { max_chance, encounter_details } = location.version_details.find(
						(v) => v.version.name === version
					);
					return {
						location: location.location_area.name,
						chances: max_chance,
						conditions: encounter_details
					};
				})
			};
		});

		return locationsPerVersion;
	};

	const showArea = (e: CustomEvent<string>) => {
		const area = locationsWithCoords.find((loc) => loc.name === e.detail);
		if (!area) return;

		selectedArea = area;
	};
</script>

<section id="data-location">
	<div id="locations" class:with-map={hasLocationsCoords}>
		{#if hasLocationsCoords}
			<Map coordinates={locationsWithCoords} on:onAreaSelected={showArea}></Map>
			{#if selectedArea}
				<MapLocationDetails selectedArea={selectedArea} on:close={() => selectedArea = null} {locationsPerGame}></MapLocationDetails>
			{/if}
		{:else if locationsPerGame.length}
			<MapLocationFallback {locationsPerGame}></MapLocationFallback>
		{:else}
			<li>no location / (trade/import/evolve) only.</li>
		{/if}
	</div>
</section>

<style>
	#data-location {
		padding: var(--small-gap);
		width: 100%;
		overflow-y: hidden;

		& > div#locations {
			display: grid;
			height: 100%;
			width: 100%;
			border-radius: var(--border-r-50);
			background-color: var(--background-second-color);
			box-shadow: var(--box-shadow);

			&.with-map {
				--margin: var(--small-gap);

				grid-template: 100% / 1fr 0.75fr;
				position: relative;

				& > *:first-child {
					grid-area: 1 / 1 / 1 / span 2;
				}
			}
		}
	}

	@media (max-width: 640px) {
		#data-location {
			padding: 0;
		}
	}
</style>
