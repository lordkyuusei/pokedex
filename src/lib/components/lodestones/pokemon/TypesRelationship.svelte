<script lang="ts">
	import Type from '$lib/components/fragments/Type.svelte';
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
			<span>
				{$t(`pokemon.type.${affinityType.name}`)}
			</span>
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
			<span>
				{$t(`pokemon.type.${coverageType.name}`)}
			</span>
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

		& > span {
			padding-inline-start: var(--smaller-gap);
		}

		& > :is(.affinity-type, .coverage-type) {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: var(--smaller-gap);
			padding-inline: var(--smaller-gap);

			&,
			& > .type-elem {
				list-style: none;
			}
		}
	}
</style>
