<svelte:options immutable />

<script lang="ts">
	import { lang } from '$lib/store/lang';
	import pokemon from '$lib/store/pokemon';
	import { generation, version } from '$lib/store/generation';
	import type { Generation, VersionGroup } from '$lib/types/generation';
	import filterGenerationsFromPokemon from '$lib/functions/filterGenerationsFromPokemon';

	export let generationsList: Generation[];

	let selectGen: Generation;
	let selectGroup: VersionGroup;

	$: genOfSelectPokemon = filterGenerationsFromPokemon(generationsList, $pokemon);
	$: updateGenOnPokemonChange(genOfSelectPokemon);
	$: versionsOfSelectGen = selectGen.versionsGroup;

	const updateGenOnPokemonChange = (generations: Generation[] = []) => {
		if (
			!$generation ||
			!selectGen ||
			!selectGroup ||
			!generations.find((g) => g.id === $generation.id)
		) {
			selectGen = generations[0];
			selectGroup = selectGen.versionsGroup[0];
			generation.set(selectGen);
			version.set(selectGroup.name);
		}
	};

	const onGenerationUpdate = () => {
		generation.set(selectGen);
		selectGroup = versionsOfSelectGen[0];
		version.set(selectGroup.name);
	};

	const onVersionUpdate = () => {
		version.set(selectGroup.name);
	};

	const getTranslation = (versionGroup: VersionGroup, lang: Lang) => {
		return versionGroup.games.reduce((acc, next) => {
			return next.i18n ? `${acc} ${next.i18n[lang]}` : `${acc} ${next.name}`;
		}, '');
	};
</script>

<section id="generations" class="generations">
	<select class="generations-gen" bind:value={selectGen} on:change={onGenerationUpdate}>
		{#each genOfSelectPokemon as gen}
			<option value={gen}>{gen.i18n.fr}</option>
		{/each}
	</select>

	<select class="generations-game" bind:value={selectGroup} on:change={onVersionUpdate}>
		{#each versionsOfSelectGen as version}
			<option value={version}>{getTranslation(version, $lang)}</option>
		{/each}
	</select>
</section>

<style>
	#generations {
		display: grid;
		grid-template-columns: 1fr 1fr;
		overflow: hidden;
		border: 1px solid var(--text-color);
		border-radius: var(--border-r-100);
		position: relative;

		&::after {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-100%, -50%);
			height: 0;
			width: 0;
			border: 15px solid transparent;
			border-right: 15px solid var(--background-color-___);
		}
	}

	.generations-gen,
	.generations-game {
		cursor: pointer;
		appearance: none;
		padding: 1em 1.5em;
		border: none;
		text-transform: uppercase;
		text-align: center;
		width: 100%;
	}

	.generations-gen:focus,
	.generations-game:focus {
		outline: none;
	}

	.generations-gen,
	.generations-gen option {
		background-color: var(--background-color-_);
		color: var(--background-color-____);
	}

	.generations-game,
	.generations-game option {
		background: var(--background-color-___);
		color: var(--text-color);
	}

	@media (max-width: 640px) {
		#generations {
			border-radius: 0;
			border: 0;
			border-bottom: 1px solid white;
		}
	}
</style>
