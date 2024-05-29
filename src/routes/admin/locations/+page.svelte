<script lang="ts">
	import { browser } from '$app/environment';

	import { version } from '$lib/store/generation';
	import { saveStatus } from '$lib/store/save';
	import { DEXAPI_LOCATION } from '$lib/constants/api.json';
	import type { Location, LocationArea, LocationNode } from '$lib/types/location';

	import Map from '$lib/components/admin/Map.svelte';
	import MapOperations from '$lib/components/admin/MapOperations.svelte';

	let gameLocation: Promise<Location> | null = null;
	let selectedLocation: LocationNode | null = null;
	let selectedArea: LocationArea | null = null;

	$: if (browser) {
		fetch(`${DEXAPI_LOCATION}/${$version}`).then((response) => {
			gameLocation = response.json();
		});
	}

	const setLocation = (location: LocationNode) => {
		selectedLocation = location;
		selectedArea = selectedLocation.areas[0];
	};

	const setArea = (location: LocationArea) => {
		selectedArea = location;
	};

	const saveCoords = async (event: CustomEvent<number[]>) => {
		if (selectedArea) {
			selectedArea.coords = event.detail;
			const result = await fetch(`${DEXAPI_LOCATION}/${$version}`, {
				method: 'POST',
				body: JSON.stringify({
					locationId: selectedLocation?._id,
					area: selectedArea
				})
			});

			if (result.ok) {
				$saveStatus = {
					status: 'Saved ✅',
					isSuccess: true
				};

				setTimeout(() => ($saveStatus = { status: 'Save', isSuccess: true }), 2500);
			}
		}
	};
</script>

<section id="admin-locations">
	{#if gameLocation}
		<aside id="locations">
			{#await gameLocation then lieu}
				{#if lieu}
					{#each lieu.regions as region (region.name)}
						<h1>{region.name}</h1>
						<ul>
							{#each region.locations as location (location.id)}
								<li>
									<button
										class:completed={location.areas.every((a) => a.coords.length)}
										class:selected={selectedLocation?.id === location.id}
										on:click={() => setLocation(location)}>{location.id}</button
									>
								</li>
							{/each}
						</ul>
					{/each}
				{/if}
			{/await}
		</aside>
		<aside id="areas">
			{#if selectedLocation}
				<h1>Areas for {selectedLocation.id}</h1>
				<ul>
					{#each selectedLocation.areas as area}
						<li>
							<button
								class:completed={area.coords.length}
								class:selected={selectedArea?.id === area.id}
								on:click={() => setArea(area)}>{area.name} ({area.i18nName?.fr})</button
							>
						</li>
					{/each}
				</ul>
				{#if selectedArea}
					<Map
						version={$version}
						on:coords={async (event) => await saveCoords(event)}
						coordinates={selectedArea.coords}
					></Map>
				{/if}
			{:else}
				<h1>Select a location on the left or choose an operation</h1>
				<MapOperations></MapOperations>
			{/if}
		</aside>
	{/if}
</section>

<style>
	section#admin-locations {
		height: 100%;
		display: grid;
		grid-template: 100% / auto 1fr;
	}

	aside#locations {
		display: grid;
		grid-auto-flow: row;
		grid-auto-columns: 1fr;

		& > ul {
			height: 100%;
			display: grid;
			grid-auto-flow: row;
			gap: var(--smallest-gap);
			place-items: center;
			overflow-y: auto;
			border-right: 1px solid var(--background-color-_);

			& > li {
				width: 100%;

				& > button {
					border-radius: 0;
					display: grid;
					width: 100%;
				}
			}
		}
	}

	aside#areas {
		padding-inline: var(--smaller-gap);
		&,
		& > ul {
			overflow-x: auto;
			overflow-y: hidden;
		}

		& > ul {
			display: grid;
			grid-auto-flow: column;
			grid-auto-columns: min-content;
			gap: var(--small-gap);

			& > li button {
				text-wrap: nowrap;
			}
		}
	}

	h1 {
		grid-row: 1;
		text-align: center;
		text-transform: uppercase;
	}

	.completed {
		filter: hue-rotate(250deg);
	}

	.selected {
		background-color: var(--third-color);
	}
</style>
