<script lang="ts">
	import type { PageData } from './$types';

	import Cover from '$lib/components/features/pokemon/Cover.svelte';
	import Stats from '$lib/components/features/pokemon/stats/Stats.svelte';
	import Abilities from '$lib/components/features/pokemon/Abilities.svelte';
	import Scores from '$lib/components/features/pokemon/scores/Scores.svelte';

	import _ from '$lib/store/i18n';
	import { lang } from '$lib/store/lang';
	import { version } from '$lib/store/generation';
	import { generation } from '$lib/store/generation';
	import type { PastTypesRef, TypeRef } from '$lib/types/pokeapi/pokemon';
	import { device } from '$lib/store/device';

	export let data: PageData;

	$: versions = $version?.split('-');

	$: description = data.specie?.flavor_text_entries.find(
		(x) => x.language.name === $lang && versions?.includes(x.version.name)
	);

	$: types = data.pokemon.past_types.length
		? fetchOldTypes(data.pokemon.past_types, data.pokemon.types, $generation.id)
		: fetchNewTypes(data.pokemon.types);

	const fetchOldTypes = (past_types: PastTypesRef[], types: TypeRef[], gen: number) => {
		const relevantTypes = past_types
			.filter((t) => gen <= Number(t.generation.url.at(-2)))
			.flatMap((t) => t.types.map((t) => t.type.name));

		return relevantTypes.length ? relevantTypes : fetchNewTypes(types);
	};

	const fetchNewTypes = (types: TypeRef[]) => types.map((t) => t.type.name);

	$: genus = data.specie?.genera.find((x) => x.language.name === $lang)?.genus;
</script>

<section id="data-stats">
	<Cover id={data.pokemon.id} sprite={data.pokemon.sprites.front_default} {types} />
	{#if $device !== 'mobile'}
		<Stats stats={data.pokemon.stats} />
		<Scores
			{genus}
			height={data.pokemon.height}
			weight={data.pokemon.weight}
			rate={data.specie.capture_rate}
			steps={data.specie.hatch_counter}
			egg={data.specie.egg_groups.map((egg) => egg.name)}
			gender={data.specie.gender_rate}
			description={description?.flavor_text ?? $_('scores.no-desc') + $version}
		/>
		<Abilities abilities={data.abilities} />
	{:else}
		<div id="stats-group">
			<hr class="group-separator" />
			<div id="group-data">
				<Stats stats={data.pokemon.stats} />
				<Scores
					{genus}
					height={data.pokemon.height}
					weight={data.pokemon.weight}
					rate={data.specie.capture_rate}
					steps={data.specie.hatch_counter}
					egg={data.specie.egg_groups.map((egg) => egg.name)}
					gender={data.specie.gender_rate}
					description={description?.flavor_text ?? $_('scores.no-desc') + $version}
				/>
				<Abilities abilities={data.abilities} />
			</div>
		</div>
	{/if}
</section>

<style>
	#data-stats {
		display: grid;
		height: 100%;
		grid-template: repeat(8, 1fr) / 1fr 1fr;
	}

	@media (min-width: 1025px) {
		#data-stats {
			overflow-y: auto;
			padding: var(--small-gap) var(--normal-gap);
			gap: var(--normal-gap);
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

	@media (max-width: 1024px) and (min-width: 415px) {
		#data-stats {
			grid-template: repeat(4, 1fr) / 100%;
			overflow-y: auto;
			padding: var(--small-gap) var(--normal-gap);
			gap: var(--normal-gap);
		}
	}

	@media (max-width: 414px) {
		#data-stats {
			overflow-x: auto;
			grid-template: 1fr 1.5fr / 100%;
		}

		:global(#stats-main) {
			margin-bottom: -1rem;
		}

		#stats-group {
			border-radius: var(--border-r-100);
			border: 1px solid transparent;
			background-color: var(--background-color);
			padding-block: 0.5rem;
		}

		#stats-group > #group-data {
			display: grid;
			grid-template-columns: repeat(3, 100%);
			overflow-x: auto;
		}

		#stats-group > .group-separator {
			width: 80%;
			height: 5px;
			background-color: var(--text-color);
			border: 1px solid transparent;
			border-radius: 1rem;
		}
	}
</style>
