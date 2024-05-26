<script lang="ts">
	import { browser } from '$app/environment';
	import Map from '$lib/components/admin/Map.svelte';
	import MapOperations from '$lib/components/admin/MapOperations.svelte';
	import { version } from '$lib/store/generation';
	import { saveStatus } from '$lib/store/save';
	import type { Location, LocationArea, LocationNode } from '$lib/types/location';

	let selectedLocation: LocationNode | null = null;
	let selectedArea: LocationArea | null = null;

	$: gameLocations = browser
		? fetch(`/api/location/version/${$version}`).then(
				async (x): Promise<Location> => await x.json()
			)
		: null;

	const setLocation = (
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
		location: LocationNode
	) => {
		selectedLocation = location;
		selectedArea = selectedLocation.areas[0];
	};

	const setArea = (
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
		location: LocationArea
	) => {
		selectedArea = location;
	};

	const saveCoords = async (event: CustomEvent<number[]>) => {
		if (selectedArea) {
			selectedArea.coords = event.detail;
			const result = await fetch(`/api/location/version/${$version}`, {
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

<section>
	<aside id="locations">
		{#await gameLocations then lieu}
			{#if lieu}
				{#each lieu.regions as region (region.name)}
					<h1>{region.name}</h1>
					<ul>
						{#each region.locations as location (location.id)}
							<li>
								<button
									class:completed={location.areas.every((a) => a.coords.length)}
									class:selected={selectedLocation?.id === location.id}
									on:click={(event) => setLocation(event, location)}>{location.id}</button
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
							on:click={(event) => setArea(event, area)}>{area.name} ({area.i18nName?.fr})</button
						>
					</li>
				{/each}
			</ul>
			{#if selectedArea}
				<Map
					version={$version}
					on:coords={async (event) => await saveCoords(event)}
					topLeftX={selectedArea.coords[0] ?? 72}
					topLeftY={selectedArea.coords[1] ?? 48}
					topRightX={selectedArea.coords[2] ?? 80}
					topRightY={selectedArea.coords[3] ?? 48}
					botRightX={selectedArea.coords[4] ?? 80}
					botRightY={selectedArea.coords[5] ?? 56}
					botLeftX={selectedArea.coords[6] ?? 72}
					botLeftY={selectedArea.coords[7] ?? 56}
				></Map>
			{/if}
		{:else}
			<h1>Select a location on the left or choose an operation</h1>
			<MapOperations></MapOperations>
		{/if}
	</aside>
</section>

<style>
	section {
		display: grid;
		grid-template: 100% / auto 1fr;
		height: 100%;
	}

	aside#locations {
		display: grid;
		grid-auto-flow: row;
		grid-template-columns: auto auto;

		& > ul {
			grid-row: 2;
			display: grid;
			grid-auto-flow: row;
			gap: var(--smallest-gap);
			place-items: center;
			overflow-y: auto;
			height: 100%;
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
		padding-inline: var(--small-gap);
		&,
		& > ul {
			overflow-x: auto;
		}

		& > ul {
			display: grid;
			grid-auto-flow: column;
			grid-auto-columns: min-content;
			gap: var(--smaller-gap);

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
