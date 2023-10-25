<script lang="ts">
	import Type from '$lib/components/common/Type.svelte';
	import {
		computeAffinities,
		computeCoverage,
		fetchFullTypes
	} from '$lib/functions/computeTypesRelationship';

	export let types: string[] = [];
	export let show: boolean = false;

	$: pkmnTypes = fetchFullTypes(types);

	$: cumulativeAffinities = computeAffinities(pkmnTypes);
	$: cumulativeCoverage = computeCoverage(pkmnTypes);
</script>

<section class="affinities" class:show={!show}>
	{#each cumulativeAffinities as affinityType}
		{#if affinityType.value.length}
			{affinityType.name}
			<ul class="affinity-type">
				{#each affinityType.value as affinity (affinity.name)}
					<li class="type-elem">
						<Type type={affinity.name} color="" />
					</li>
				{/each}
			</ul>
		{/if}
	{/each}
</section>
<section class="coverage" class:show>
	{#each cumulativeCoverage as coverageType}
		{#if coverageType.value.length}
			{coverageType.name}
			<ul class="coverage-type">
				{#each coverageType.value as affinity (affinity.name)}
					<li class="type-elem">
						<Type type={affinity.name} color="" />
					</li>
				{/each}
			</ul>
		{/if}
	{/each}
</section>

<style>
	.affinities,
	.coverage {
		display: none;
		width: 100%;
	}

	.affinities.show,
	.coverage.show {
		display: grid;
		gap: var(--small-gap);
	}

	.affinities > .affinity-type,
	.coverage > .coverage-type {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--normal-gap);
		padding-inline: 1em;
	}

	.affinities > .affinity-type > .type-elem,
	.coverage > .coverage-type {
		list-style: none;
	}
</style>
