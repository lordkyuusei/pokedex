<script lang="ts">
	import type { PageData } from './$types';

	import Cover from '$lib/components/lodestones/pokemon/Cover.svelte';
	import Scores from '$lib/components/lodestones/pokemon/Scores.svelte';
	import Stats from '$lib/components/lodestones/pokemon/Stats.svelte';
	import Abilities from '$lib/components/lodestones/pokemon/Abilities.svelte';

	import _ from '$lib/store/i18n';
	import { lang } from '$lib/store/lang';
	import { version } from '$lib/store/generation';
	import { generation } from '$lib/store/generation';
	import { isMobile } from '$lib/store/device';
	import { computePokemonTypes } from '$lib/functions/getPokemonTypes';

	export let data: PageData;

	$: versions = $version?.split('-');

	$: description = data.specie?.flavor_text_entries.find(
		(x) => x.language.name === $lang && versions?.includes(x.version.name)
	);

	$: types = computePokemonTypes(data.pokemon, $generation.id);

	$: genus = data.specie?.genera.find((x) => x.language.name === $lang)?.genus;
</script>

<section id="data-stats">
	{#if !$isMobile}
		<Cover id={data.pokemon.id} sprite={data.pokemon.sprites.front_default} {types} />
	{/if}
	<Stats stats={data.pokemon.stats} />
	<Scores
		{genus}
		height={data.pokemon.height}
		weight={data.pokemon.weight}
		rate={data.specie.capture_rate}
		steps={data.specie.hatch_counter}
		egg={data.specie.egg_groups.map((egg) => egg.name)}
		gender={data.specie.gender_rate}
		description={description?.flavor_text}
	/>
	<Abilities abilities={data.abilities} />
</section>

<style>
	#data-stats {
		display: grid;
		height: 100%;
		grid-template: repeat(8, 1fr) / 1fr 1fr;
	}

	@media (min-width: 1024px) {
		#data-stats {
			overflow-y: auto;
			padding: var(--small-gap);
			gap: calc(var(--small-gap) + var(--smaller-gap));
		}

		:global(#stats-main) {
			grid-area: 1 / 1 / 5 / 1;
		}

		:global(#stats-statistics) {
			grid-area: 1 / 2 / 6 / 2;
		}

		:global(#pokemon-scores) {
			grid-area: 5 / 1 / 9 / 1;
		}

		:global(#stats-abilities) {
			grid-area: 6 / 2 / 9 / 2;
		}
	}

	@media (max-width: 1024px) and (min-width: 640px) {
		#data-stats {
			grid-template: repeat(4, 1fr) / 100%;
			overflow-y: auto;
			padding: var(--small-gap) var(--normal-gap);
			gap: var(--normal-gap);
		}
	}

	@media (max-width: 640px) {
		#data-stats {
			overflow-x: auto;
			grid-template: 100% / 100% 100% 100%;
			gap: var(--smaller-gap);
		}

		:global(#stats-main) {
			margin-bottom: -1rem;
		}
	}
</style>
