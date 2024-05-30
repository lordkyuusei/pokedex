<script lang="ts">
	import { browser } from '$app/environment';
	import { version } from '$lib/store/generation';
	import type { Location } from '$lib/types/location';

	$: locations = browser
		? fetch(`/api/location/version/${$version}`).then(
				async (x): Promise<Location[]> => await x.json()
			)
		: [];
</script>

<section>
	{#await locations then lieux}
		{#each lieux as lieu}
			{#each lieu.regions as region}
				<h1>{region.name}</h1>
				{#each region.locations as location}
					<div>{location.id}</div>
				{/each}
			{/each}
		{/each}
	{/await}
</section>
