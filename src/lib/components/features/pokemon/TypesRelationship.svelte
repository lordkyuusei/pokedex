<script lang="ts">
	import Type from '$lib/components/common/Type.svelte';
	import {
		computeAffinities,
		computeCoverage,
		fetchFullTypes
	} from '$lib/functions/computeTypesRelationship';
	import t from '$lib/store/i18n';

	export let types: string[] = [];
	export let show: boolean = false;

	$: pkmnTypes = fetchFullTypes(types);

	$: cumulativeAffinities = computeAffinities(pkmnTypes);
	$: cumulativeCoverage = computeCoverage(pkmnTypes);
</script>

<section class="affinities" class:show={!show}>
	{#each cumulativeAffinities as affinityType}
		{#if affinityType.value.length}
			<p>
				{$t(`pokemon.type.${affinityType.name}`)}
			</p>
			<ul class="affinity-type">
				{#each affinityType.value as affinity (affinity.name)}
					<li class="type-elem">
						<Type type={affinity.name} />
					</li>
				{/each}
			</ul>
		{/if}
	{/each}
</section>
<section class="coverage" class:show>
	{#each cumulativeCoverage as coverageType}
		{#if coverageType.value.length}
			<p>
				{$t(`pokemon.type.${coverageType.name}`)}
			</p>
			<ul class="coverage-type">
				{#each coverageType.value as affinity (affinity.name)}
					<li class="type-elem">
						<Type type={affinity.name} />
					</li>
				{/each}
			</ul>
		{/if}
	{/each}
</section>

<style>
	:is(.affinities, .coverage) {
		display: none;
		width: 100%;

		&.show {
			display: grid;
			gap: var(--small-gap);
		}

		& > p {
			padding-inline-start: 0.5em;
		}
		& > :is(.affinity-type, .coverage-type) {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: var(--normal-gap);
			padding-inline: 0.5em;

			&,
			& > .type-elem {
				list-style: none;
			}
		}
	}
</style>
