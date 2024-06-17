<svelte:options immutable />

<script lang="ts">
	import { browser } from '$app/environment';
	import { version } from '$lib/store/generation';
	import { lang } from '$lib/store/lang';
	import t from '$lib/store/i18n';
	import { DEXAPI_LOCATION } from '$lib/constants/api.json';
	import type { PokemonLocationArea } from '$lib/types/pokeapi/location-area';
	import type { Location, LocationWithCoords, SimplifiedLocation } from '$lib/types/location';

	import type { PageData } from './$types';
	import Map from '$lib/components/features/Map.svelte';

	export let data: PageData;

	let selectedGame: string | null;
	let selectedArea: LocationWithCoords | null = null;
	let selectedCondition: number | null = null;
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
		setSelectedGame(locationsPerGame[0]);

		fetch(`${DEXAPI_LOCATION}/${$version}`).then(async (response) => {
			const gameLocations: Location = await response.json();
			const flatLocations = gameLocations.regions.flatMap(({ locations }) =>
				locations.flatMap(({ areas }) => areas)
			);

			const mapLocationToCoordinates = locationsPerGame.flatMap(({ locations }) =>
				locations.map((loc) => {
					const name = loc.location;
					const locationCoordinates = flatLocations.find((loc) => loc.name === name);
					if (!locationCoordinates) return null;

					return {
						name,
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

	const setSelectedGame = (game: SimplifiedLocation) => {
		selectedGame = game.version;
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
			<Map pkmnCoordinates={locationsWithCoords} version={$version} on:onAreaSelected={showArea}
			></Map>
			{#if selectedArea}
				<aside id="location-details">
					<header id="details-header">
						<span>{selectedArea.i18nName[$lang]}</span>
						<button class="round" on:click={() => (selectedArea = null)}>✖️</button>
					</header>
					<div id="details-game">
						{#each locationsPerGame as game}
							<button
								class:selected={selectedGame === game.version}
								on:click={() => setSelectedGame(game)}>{game.version}</button
							>
						{/each}
					</div>
					<div id="details-area">
						<table>
							<thead>
								<tr>
									<th>Chances</th>
									<th>Niveaux</th>
									<th>Méthode</th>
									<th>Conditions</th>
								</tr>
							</thead>
							<tbody>
								{#each selectedArea.conditions as condition, i}
									<tr>
										<td class="chance">{condition.chance}%</td>
										<td class="level">Lv. [{condition.min_level} - {condition.max_level}]</td>
										<td class="method">{condition.method.name}</td>
										<td>
											{#if condition.condition_values.length > 0}
												<button class="round condition" on:click={() => (selectedCondition = i)}
													>?</button
												>
											{:else}
												✖️
											{/if}
										</td>
									</tr>
									{#if condition.condition_values.length > 0 && selectedCondition === i}
										<!-- {@debug condition} -->
										<tr>
											<td style="text-transform: capitalize" colspan="4">
												{condition.condition_values
													.map((c) => $t(`condition.${c.name}`))
													.join(', ')}
											</td>
										</tr>
									{/if}
								{/each}
							</tbody>
						</table>
					</div>
				</aside>
			{/if}
		{:else if locationsPerGame.length}
			<table>
				<thead>
					<tr>
						<th></th>
						<th colspan="3">Lieu</th>
						<th colspan="14">Détails(%,méthode,niveau)</th>
					</tr>
				</thead>
				<tbody>
					{#each locationsPerGame as locationGroup}
						{#each locationGroup.locations as location, i}
							<tr>
								{#if i === 0}
									<td colspan="3" rowspan={locationGroup.locations.length}>
										{locationGroup.version}
									</td>
								{/if}
								<td colspan="3">
									{location.location}
								</td>
								<td colspan="12">
									{#each location.conditions as condition}
										{condition.chance}% {condition.method.name} lvl[{condition.min_level ===
										condition.max_level
											? condition.max_level
											: `${condition.min_level}/${condition.max_level}`}]
										{#if condition.condition_values.length}
											({condition.condition_values.map((val) => val.name)})
										{:else}
											(all-the-time)
										{/if}
										<br />
									{/each}
								</td>
							</tr>
						{/each}
					{/each}
				</tbody>
			</table>
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

				& > aside#location-details {
					grid-area: 1 / 2 / 1 / 2;
					display: grid;
					grid-template: var(--layout-header-size) calc(var(--layout-header-size) / 1.5) 1fr / 100%;
					height: min-content;
					max-height: calc(100% - calc(var(--margin) / 0.5));
					width: calc(100% - var(--margin));
					margin: calc(var(--margin)) var(--margin) 0 0;
					border-radius: var(--border-r-50);
					background-color: var(--background-color);
					z-index: 1;

					& > header#details-header {
						display: grid;
						grid-template: 100% / 1fr auto;
						place-items: center;
						padding-inline: var(--small-gap);
						background-color: var(--text-color);
						border-radius: var(--border-r-50) var(--border-r-50) 0 0;

						& > span {
							grid-area: 1 / 1 / 1 / span 2;
							color: var(--background-color);
						}

						& > button {
							grid-area: 1 / 2 / 1 / 2;
						}
					}

					& > div#details-game {
						display: grid;
						grid-auto-flow: column;
						grid-auto-columns: 1fr;

						& > button.selected {
							background-color: var(--second-color);
						}
					}

					& > div#details-area {
						padding: var(--smaller-gap);

						& > table :is(th, td) {
							text-align: center;
						}
					}
				}
			}

			& > table thead {
				text-align: center;
			}
			& > table td {
				text-align-last: justify;
			}
		}
	}

	@media (max-width: 640px) {
		#data-location {
			padding: 0;
		}

		#data-location > #location {
			border-radius: 0;
		}
	}
</style>
