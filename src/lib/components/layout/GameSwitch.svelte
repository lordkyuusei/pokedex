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
	$: onExternalGenerationUpdate(genOfSelectPokemon);
	$: versionsOfSelectGen = selectGen.versionsGroup;

	const onExternalGenerationUpdate = (generations: Generation[] = []) => {
		selectGen = generations[generations.length - 1];
		selectGroup = selectGen.versionsGroup[0];
		generation.set(selectGen);
		version.set(selectGroup.name);
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
			return `${acc} ${next.i18n[lang]}`;
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
	}

	.generations {
		border: 1px solid white;
		border-radius: var(--border-r-100);
		position: relative;
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
		background-color: var(--text-color);
		color: var(--background-color);
	}

	.generations-game,
	.generations-game option {
		background: var(--background-color);
		color: var(--text-color);
	}

	.generations::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-95%, -50%);
		height: 0;
		width: 0;
		border: 15px solid transparent;
		border-right: 15px solid var(--background-color);
	}
</style>
