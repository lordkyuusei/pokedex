<script lang="ts">
	import Evolution from '$lib/components/lodestones/pokemon/Evolution.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section id="data-evolution">
	<Evolution evolution={data.evolution} />
</section>

<style>
	#data-evolution {
		padding: var(--small-gap);
	}

	@media (max-width: 640px) {
		#data-evolution {
			padding: 0;
		}

		#data-evolution > #evolution {
			border-radius: 0;
		}
	}
</style>
