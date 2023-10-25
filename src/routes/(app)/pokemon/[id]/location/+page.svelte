<svelte:options immutable />

<script lang="ts">
	import type { PageData } from './$types';
	import { version } from '$lib/store/generation';
	import type { PokemonLocationArea } from '$lib/types/pokeapi/location-area';

	export let data: PageData;

	$: rawLocations = extractLocations(data.location);
	$: locations = rawLocations.filter((l) => $version.includes(l.version));

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
	<section id="location">
		<section id="location-map">
			<img src="/maps/{$version}.png" alt={$version} />
		</section>
		<section id="location-details">
			{#if locations.length}
				{#each locations as locationGroup}
					<h1>{locationGroup.version}</h1>
					{#each locationGroup.locations as location}
						<li>{location.location} - {location.chances}%</li>
						<ul>
							{#each location.conditions as condition}
								<li>
									{condition.method.name} | {condition.chance}% chances, lvl[{condition.min_level} /
									{condition.max_level}]
								</li>
								{#if condition.condition_values.length}
									<ul>
										<li>only if {condition.condition_values.map((val) => val.name)}</li>
									</ul>
								{/if}
							{/each}
						</ul>
					{/each}
				{/each}
			{:else}
				<li>no location / (trade/import) only.</li>
			{/if}
		</section>
	</section>
</section>

<style>
	#data-location {
		padding: 2em;
		height: 100%;
		overflow: auto;
	}

	#data-location > #location {
		display: grid;
		grid-template: 'location-map location-details' 100% / 2fr 1fr;

		height: 100%;
		width: 100%;
		border-radius: var(--border-r-200);
		background-color: var(--background-color);
		box-shadow: 0 0 10px 5px var(--background-secondary);
		overflow: auto;
	}

	#data-location > #location > #location-map {
		height: 100%;
		width: 100%;
		overflow: auto;
	}

	#data-location > #location > #location-map img {
		height: 100%;
		image-rendering: pixelated;
	}
</style>
