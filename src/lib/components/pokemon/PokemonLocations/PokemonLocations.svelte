<script lang="ts">
	import { fetchPokemonLocationArea } from '$lib/api';

	import { t } from '$lib/store/i18n/i18n';

	import type { PokemonLocationArea } from '$lib/types/PokemonLocationArea';
	import Card from '../../barebone/Card.svelte';
	import Map from './Map.svelte';

	export let pokemon: number;

	let versionChosen: string = '';

	$: pokemonLocations = extractLocations(pokemon);
	$: versionLocations = extractVersionLocations(versionChosen);

	const extractLocations = async (pokemon: number) => {
		const locations: PokemonLocationArea[] = await fetchPokemonLocationArea(pokemon);
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

		versionChosen = versions[0];

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

	const extractVersionLocations = async (version: string) => {
		if (version !== '') {
			return (
				(await pokemonLocations).find((location) => location.version === version)?.locations || []
			);
		} else {
			return [];
		}
	};
</script>

<Card title={$t('title.locations')}>
	<div class="pokemon-locations">
		{#await pokemonLocations}
			<div />
		{:then pkmnLocation}
			{#each pkmnLocation as location}
				<button
					class="location-button"
					title={location.version}
					class:chosen={versionChosen === location.version}
					on:click={() => (versionChosen = location.version)}>{location.version}</button
				>
			{/each}
		{/await}
	</div>
	<div class="location-map">
		<ul>
			{#await versionLocations}
				<div />
			{:then vrsnLocations}
				{#if vrsnLocations?.length}
					{#each vrsnLocations as location}
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
				{:else}
					<li>{$t('error.no-locations')}</li>
				{/if}
			{/await}
		</ul>
	</div>
</Card>

<style>
	.pokemon-locations {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		width: 100%;
		overflow-x: auto;
		border-radius: var(--theme-border-r) var(--theme-border-r) 0 0;
	}

	.location-button {
		font: inherit;
		border-width: 0 0 1px 0;
		background-color: var(--theme-background);
		color: var(--theme-text);
		cursor: pointer;
		width: 100%;
		transition: 0.2s;
		white-space: nowrap;
		text-transform: capitalize;
		border-color: var(--theme-text);
	}

	.location-button:hover {
		color: var(--theme-background);
		background-color: var(--theme-text);
	}

	.chosen {
		color: white;
		background-color: var(--theme-secondary);
	}

	.location-map {
		width: 100%;
		overflow-y: scroll;
		display: flex;
		justify-content: space-evenly;
	}

	@media (max-width: 768px) {
		.location-map {
			flex-direction: column;
			justify-content: flex-start;
		}
	}
</style>
