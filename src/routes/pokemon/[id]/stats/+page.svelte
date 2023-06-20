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

	export let data: PageData;

	$: versions = $version?.split('-');

	$: types = data.pokemon.past_types.length
		? fetchOldTypes(data.pokemon.past_types, data.pokemon.types, $generation.id)
		: fetchNewTypes(data.pokemon.types);

	$: description = data.specie?.flavor_text_entries.find(
		(x) => x.language.name === $lang && versions?.includes(x.version.name)
	);

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
</section>

<style>
	#data-stats {
		display: grid;
		height: 100%;
		grid-template:
			'stats-typing stats-jauges' 1fr
			'. .' 0.25fr
			'stats-misc stats-abilities' 1fr / 1fr 1fr;

		overflow-y: auto;
		gap: var(--normal-gap);
		padding: var(--small-gap) var(--normal-gap);
	}
</style>
