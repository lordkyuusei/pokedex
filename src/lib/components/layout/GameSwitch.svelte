<svelte:options immutable />

<script lang="ts">
	import { lang } from '$lib/store/lang';
	import pokemon from '$lib/store/pokemon';
	import { generation, version } from '$lib/store/generation';
	import type { Generation, VersionGroup } from '$lib/types/generation';
	import filterGenerationsFromPokemon from '$lib/functions/filterGenerationsFromPokemon';

	export let generationsList: Generation[];

	let selectedGen: Generation;
	let selectedGroup: VersionGroup;

	$: genOfSelectPokemon = filterGenerationsFromPokemon(generationsList, $pokemon);
	$: updateGenOnPokemonChange(genOfSelectPokemon);
	$: versionsOfSelectedGen = selectedGen?.versionsGroup ?? [];

	const updateGenOnPokemonChange = (generations: Generation[] = []) => {
		if (
			generations.length &&
			(!$generation ||
				!selectedGen ||
				!selectedGroup ||
				!generations.find((g) => g.id === $generation.id))
		) {
			selectedGen = generations[0];
			selectedGroup = selectedGen.versionsGroup[0];
			generation.set(selectedGen);
			version.set(selectedGroup.name);
		}
	};

	const onGenerationUpdate = () => {
		generation.set(selectedGen);
		selectedGroup = selectedGen?.versionsGroup[0];
		version.set(selectedGroup.name);
	};

	const onVersionUpdate = () => {
		version.set(selectedGroup.name);
	};

	const getTranslation = (versionGroup: VersionGroup, lang: Lang) => {
		return versionGroup.games.reduce((acc, next) => {
			return next.i18n ? `${acc} ${next.i18n[lang]}` : `${acc} ${next.name}`;
		}, '');
	};
</script>

<div id="generations" class="generations">
	<select class="generations-gen" bind:value={selectedGen} on:change={onGenerationUpdate}>
		{#each genOfSelectPokemon as gen}
			<option value={gen}>{gen.i18n.fr}</option>
		{/each}
	</select>
	<select class="generations-game" bind:value={selectedGroup} on:change={onVersionUpdate}>
		{#each versionsOfSelectedGen as version}
			<option value={version}>{getTranslation(version, $lang)}</option>
		{/each}
	</select>
</div>

<style>
	#generations {
		--border-size: 0px;

		display: grid;
		grid-template-columns: 1fr 1fr;
		border: var(--border-size) solid var(--background-color-_);
		border-radius: var(--border-r-50);
		position: relative;
		height: 100%;

		& > [class^="generations"] {
			cursor: pointer;
			padding-inline: var(--small-gap);
			appearance: none;
			border: none;
			text-transform: uppercase;
			text-align: center;

			&:focus {
				outline: none;
			}
		}

		& > .generations-gen {
			border-radius: calc(var(--border-r-50) - var(--border-size)) 0 0 calc(var(--border-r-50) - var(--border-size));

			&, & > option {
				background-color: var(--background-color-_);
				color: var(--background-color-____);
			}
		}

		& > .generations-game {
			border-radius: 0 calc(var(--border-r-50) - var(--border-size)) calc(var(--border-r-50) - var(--border-size)) 0;

			&, & > option {
				background: var(--background-color-___);
				color: var(--text-color);
			}
		}

		&::after {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-100%, -50%);
			height: 0;
			width: 0;
			border: 1rem solid transparent;
			border-right: 1rem solid var(--background-color-___);
		}
	}

	@media (max-width: 640px) {		
		#generations, #generations > [class^="generations"] {
			border-radius: 0;
			border: 0;
		}

		#generations {
			border-bottom: var(--border-size) solid var(--background-color-_);
		}
	}
</style>
