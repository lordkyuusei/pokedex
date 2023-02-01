<script lang="ts">
	import { t } from '$lib/store/i18n/i18n';
	import POKEMON_TYPES from '$lib/store/types';
	import type { PokemonType } from '$lib/types/PokemonType';
	import PokemonTypeElem from '../shared/PokemonType.svelte';
	import extractDuplicates from '$lib/extractDuplicatesFromArray';

	export let types: string[] = [];
	export let background: string;

	let show: boolean = false;
	let showAffinity = true;

	$: pkmnTypes = fetchFullTypes(types);

	$: cumulativeAffinities = computeAffinities(pkmnTypes);
	$: cumulativeCoverage = computeCoverage(pkmnTypes);

	const fetchFullTypes = (types: string[]) =>
		types.reduce((acc, type) => {
			const ref = POKEMON_TYPES.find((t) => t.name === type);
			return [...acc, ref];
		}, [] as PokemonType[]);

	const computeAffinities = (types: PokemonType[]) => {
		const immunities = types.flatMap((type) =>
			POKEMON_TYPES.filter((t) => type.immunities.includes(t.id))
		);

		const rawRawResistances = types.flatMap((pkmnType) =>
			POKEMON_TYPES.filter((t) => !immunities.includes(t)).filter((t) =>
				pkmnType.resistances.includes(t.id)
			)
		);

		const rawResistances = rawRawResistances.filter(
			(t) => types.findIndex((pkmnType) => pkmnType.weaknesses.includes(t.id)) === -1
		);

		const [doubleResistances, resistances] = extractDuplicates(rawResistances, 'name');

		const neutral = rawRawResistances.filter((t) => !resistances.includes(t));

		const rawWeaknesses = types.flatMap((pkmnType) =>
			POKEMON_TYPES.filter((t) => ![...immunities, ...resistances, ...neutral].includes(t)).filter(
				(t) => pkmnType.weaknesses.includes(t.id)
			)
		);

		const [doubleWeaknesses, weaknesses] = extractDuplicates(rawWeaknesses, 'name');

		return [
			{ name: 'double-weaknesses', value: doubleWeaknesses },
			{ name: 'weaknesses', value: weaknesses },
			{ name: 'resistances', value: resistances },
			{ name: 'double-resistances', value: doubleResistances },
			{ name: 'immunities', value: immunities }
		];
	};

	const computeCoverage = (types: PokemonType[]) => {
		const [firstType, secondType] = types;

		const superEffective = [
			...new Set(
				types.flatMap((pkmnType) => POKEMON_TYPES.filter((t) => t.weaknesses.includes(pkmnType.id)))
			)
		];

		const rawNotEffective = POKEMON_TYPES.filter((t) => !superEffective.includes(t)).filter((t) =>
			t.resistances.includes(firstType.id)
		);

		const notEffective = secondType
			? rawNotEffective.filter((t) => t.resistances.includes(secondType.id))
			: rawNotEffective;

		const rawIneffective = POKEMON_TYPES.filter(
			(t) => ![...superEffective, ...notEffective].includes(t)
		).filter((t) => t.immunities.includes(firstType.id));

		const ineffective = secondType
			? rawIneffective.filter((t) => t.immunities.includes(secondType.id))
			: rawIneffective;

		const output = [
			{ name: 'super-effective', value: superEffective },
			{ name: 'not-super-effective', value: notEffective },
			{ name: 'no-effect', value: ineffective }
		];

		return output;
	};
</script>

<section class="table">
	<button class="button-toggle" on:click={() => (show = !show)}>📚</button>
	<section class="table-affinities-coverage" class:show style:background>
		<header class="table-toggle">
			<h1 class="toggle-title">{$t(`types.${showAffinity ? 'affinities' : 'coverage'}`)}</h1>
			<button class="button-toggle" on:click={() => (showAffinity = !showAffinity)}
				>{showAffinity ? '🛡️' : '⚔️'}</button
			>
		</header>
		<hr />
		<section class="affinities" class:show={showAffinity}>
			{#each cumulativeAffinities as affinityType}
				{#if affinityType.value.length}
					{$t(`types.affinity.${affinityType.name}`)}
					<ul class="affinity-type">
						{#each affinityType.value as affinity (affinity.name)}
							<li class="type-elem">
								<PokemonTypeElem name={affinity.name} />
							</li>
						{/each}
					</ul>
				{/if}
			{/each}
		</section>
		<section class="coverage" class:show={!showAffinity}>
			{#each cumulativeCoverage as coverageType}
				{#if coverageType.value.length}
					{$t(`types.coverage.${coverageType.name}`)}
					<ul class="coverage-type">
						{#each coverageType.value as affinity (affinity.name)}
							<li class="type-elem">
								<PokemonTypeElem name={affinity.name} />
							</li>
						{/each}
					</ul>
				{/if}
			{/each}
		</section>
		<button class="button-toggle" on:click={() => (show = !show)}>📚</button>
	</section>
</section>

<style>
	hr {
		width: 100%;
		border: none;
		height: 1px;
		background-color: var(--theme-text);
	}
	.button-toggle {
		padding: 0.5em;
		font-size: 1rem;
		text-align: center;
		border-radius: var(--theme-border-r);
		width: fit-content;
		border: none;
		cursor: pointer;
		background-color: var(--theme-cardglass);
	}

	.table > .table-affinities-coverage > .button-toggle {
		position: sticky;
		bottom: 0;
		left: 88%;
	}

	.table-affinities-coverage {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: calc(100% + 0.25rem);
		overflow-y: auto;
		display: none;
		grid-template-rows: repeat(5, auto);
		background-color: var(--theme-alt-background);
		border-radius: var(--theme-border-r);
		padding: var(--theme-border-r);
	}

	.table-affinities-coverage.show {
		display: grid;
	}

	.table-affinities-coverage > .table-toggle {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.table-affinities-coverage > .affinities,
	.table-affinities-coverage > .coverage {
		display: none;
		width: 100%;
	}

	.table-affinities-coverage > .affinities.show,
	.table-affinities-coverage > .coverage.show {
		display: grid;
	}

	.table-affinities-coverage > .affinities > .affinity-type,
	.table-affinities-coverage > .coverage > .coverage-type {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		flex-wrap: wrap;
		gap: 0.25em;
		padding-inline-start: 0.25em;
	}

	.table-affinities-coverage > .affinities > .affinity-type > .type-elem,
	.table-affinities-coverage > .coverage > .coverage-type {
		list-style: none;
	}
</style>
