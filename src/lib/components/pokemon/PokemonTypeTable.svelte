<script lang="ts">
	import { TYPES, type PokemonType } from '$lib/types/PokemonType';
	import POKEMON_TYPES from '$lib/store/types';
	import PokemonTypeElem from '../shared/PokemonType.svelte';
	import { t } from '$lib/store/i18n/i18n';

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

	const computeAffinities = (pkmnTypes: PokemonType[]) => {
		const immunities = pkmnTypes.flatMap((type) =>
			POKEMON_TYPES.filter((t) => type.immunities.includes(t.id))
		);

		const rawResistances = pkmnTypes.flatMap((pkmnType) =>
			POKEMON_TYPES.filter((t) => !immunities.includes(t)).filter((t) =>
				pkmnType.resistances.includes(t.id)
			)
		);

		const resistances = rawResistances.filter(
			(t) => pkmnTypes.findIndex((pkmnType) => pkmnType.weaknesses.includes(t.id)) === -1
		);

		const neutral = rawResistances.filter((t) => !resistances.includes(t));

		const rawWeaknesses = pkmnTypes.flatMap((pkmnType) =>
			POKEMON_TYPES.filter((t) => ![...immunities, ...resistances, ...neutral].includes(t)).filter(
				(t) => pkmnType.weaknesses.includes(t.id)
			)
		);

		const doubleWeaknesses = rawWeaknesses.filter(
			(weakness, i, wks) => wks.indexOf(weakness) !== i
		);

		return [
			{ name: 'immunities', value: immunities },
			{ name: 'resistances', value: resistances },
			{ name: 'weaknesses', value: rawWeaknesses }
		];
	};

	const computeCoverage = (pkmnTypes: PokemonType[]) => {
		const superEffective = pkmnTypes.flatMap((pkmnType) =>
			POKEMON_TYPES.filter((t) => t.weaknesses.includes(pkmnType.id))
		);

		const rawNotEffective = pkmnTypes.flatMap((pkmnType) =>
			POKEMON_TYPES.filter((t) => !superEffective.includes(t)).filter((t) =>
				t.resistances.includes(pkmnType.id)
			)
		);

		const ineffective = [
			...new Set(
				pkmnTypes.flatMap((pkmnType) =>
					POKEMON_TYPES.filter((t) => ![...superEffective, ...rawNotEffective].includes(t)).filter(
						(t) => t.immunities.includes(pkmnType.id)
					)
				)
			)
		];

		const output = [
			{ name: 'no-effect', value: ineffective },
			{ name: 'not-super-effective', value: rawNotEffective },
			{ name: 'super-effective', value: superEffective }
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
				>{showAffinity ? '⚔️' : '🛡️'}</button
			>
		</header>
		<hr />
		<section class="affinities" class:show={showAffinity}>
			{#each cumulativeAffinities as affinityType}
				{$t(`types.affinity.${affinityType.name}`)}
				<ul class="affinity-type">
					{#each affinityType.value as affinity}
						<li class="type-elem">
							<PokemonTypeElem name={affinity.name} />
						</li>
					{/each}
				</ul>
			{/each}
		</section>
		<section class="coverage" class:show={!showAffinity}>
			{#each cumulativeCoverage as coverageType}
				{$t(`types.coverage.${coverageType.name}`)}
				<ul class="coverage-type">
					{#each coverageType.value as affinity}
						<li class="type-elem">
							<PokemonTypeElem name={affinity.name} />
						</li>
					{/each}
				</ul>
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
		border-radius: 25px;
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
		--padding: 10px;
		position: absolute;
		top: 0;
		left: 0;
		height: calc(100% - var(--padding) * 2);
		width: calc(100% - var(--padding) * 2);
		overflow-y: scroll;
		display: none;
		grid-template-rows: repeat(5, auto);
		background-color: var(--theme-alt-background);
		border-radius: 10px;
		padding: var(--padding);
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
