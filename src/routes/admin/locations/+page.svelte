<script lang="ts">
	import { browser } from '$app/environment';
	import Map from '$lib/components/features/Map.svelte';
	import { version } from '$lib/store/generation';
	import type { Location, LocationArea, LocationNode } from '$lib/types/location';

	let selectedLocation: LocationNode | null = null;
	let selectedArea: LocationArea | null = null;

	$: locations = browser
		? fetch(`/api/location/version/${$version}`).then(
				async (x): Promise<Location[]> => await x.json()
			)
		: new Array<Location>();

	$: selectedLocation = locations?.length > 0 ? locations[0].regions[0].locations[0] : null;

	const setLocation = (
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
		location: LocationNode
	) => {
		selectedLocation = location;
	};

	const setArea = (
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
		location: LocationArea
	) => {
		selectedArea = location;
	};

	const saveCoords = async (event: CustomEvent<number[]>) => {
		if (selectedArea) {
			console.log(event);
			selectedArea.coords = event.detail;
			await fetch(`/api/location/version/${$version}`, {
				method: 'POST',
				body: JSON.stringify({
					locationId: selectedLocation?._id,
					area: selectedArea
				})
			});
		}
	};
</script>

<section>
	<aside id="locations">
		{#await locations then lieux}
			{#each lieux as lieu (lieu.name)}
				{#each lieu.regions as region (region.name)}
					<h1>{region.name}</h1>
					<ul>
						{#each region.locations as location (location.id)}
							<li>
								<button on:click={(event) => setLocation(event, location)}>{location.id}</button>
							</li>
						{/each}
					</ul>
				{/each}
			{/each}
		{/await}
	</aside>
	<aside id="areas">
		{#if selectedLocation}
			<h1>Areas for {selectedLocation.id}</h1>
			<ul>
				{#each selectedLocation.areas as area}
					<li>
						<button on:click={(event) => setArea(event, area)}
							>{area.name} ({area.i18nName?.fr})</button
						>
					</li>
				{/each}
			</ul>
			{#if selectedArea}
				<Map
					version={$version}
					on:coords={async (event) => await saveCoords(event)}
					topLeftX={selectedArea.coords[0] ?? 0}
					topLeftY={selectedArea.coords[1] ?? 0}
					topRightX={selectedArea.coords[2] ?? 0}
					topRightY={selectedArea.coords[3] ?? 0}
					botRightX={selectedArea.coords[4] ?? 0}
					botRightY={selectedArea.coords[5] ?? 0}
					botLeftX={selectedArea.coords[6] ?? 0}
					botLeftY={selectedArea.coords[7] ?? 0}
				></Map>
			{/if}
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
		& > ul {
			display: flex;
			gap: var(--small-gap);
		}
	}

	h1 {
		grid-row: 1;
		text-align: center;
		text-transform: uppercase;
	}
</style>
