<svelte:options immutable />

<script lang="ts">
	import type { PageData } from './$types';
	import { version } from '$lib/store/generation';
	import type { PokemonLocationArea } from '$lib/types/pokeapi/location-area';
	import { getGamesMaps } from '$lib/functions/getGamesMaps';

	export let data: PageData;

	const MAPS_NAMES = getGamesMaps();

	$: rawLocations = extractLocations(data.location);
	$: locations = rawLocations.filter((l) => $version.includes(l.version));
	$: mapName = MAPS_NAMES.find((map) => map.includes($version));

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
</script>

<section id="data-location">
	<div
		id="location"
		style={`background-image: url("/maps/${mapName}.png"); background-size: cover; background-blend-mode: overlay`}
	>
		{#if locations.length}
			<table>
				<thead>
					<tr>
						<th></th>
						<th colspan="3">Lieu</th>
						<th colspan="14">Détails(%,méthode,niveau)</th>
					</tr>
				</thead>
				<tbody>
					{#each locations as locationGroup}
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

		& > #location {
			display: grid;
			place-items: center;
			overflow: auto;

			height: 100%;
			border-radius: var(--border-r-200);
			background-color: var(--background-color-___);
			box-shadow: var(--box-shadow);

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
