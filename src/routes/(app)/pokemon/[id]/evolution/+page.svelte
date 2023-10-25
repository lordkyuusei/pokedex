<script lang="ts">
	import Evolution from '$lib/components/features/pokemon/Evolution.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section id="data-evolution">
	<Evolution evolution={data.evolution} />
</section>

<style>
	#data-evolution {
		padding: 2em;
		height: 100%;
	}
</style>
