<script lang="ts">
	import type { EntityRef } from '$lib/types/Pokemon';
	import type { VarietyRef } from '$lib/types/PokemonSpecie';
	import { onMount } from 'svelte';

	import Card from './PokemonLayouts/Card.svelte';

	export let forms: EntityRef[] = [];
	export let varieties: VarietyRef[] = [];

	onMount(() => {
		console.log(forms, varieties);
	});
</script>

<Card cover={true} full={true}>
	<div class="pokemon-varieties" />
</Card>

<style scoped>
</style>
