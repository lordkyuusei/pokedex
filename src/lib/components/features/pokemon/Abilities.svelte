<script lang="ts">
	import { lang } from '$lib/store/lang';
	import type { PokemonAbility } from '$lib/types/pokeapi/ability';
	import { fade } from 'svelte/transition';

	export let abilities: PokemonAbility[] = [];

	$: chosenAbility = abilities[0];

	const setAbility = async (ability: PokemonAbility) => {
		chosenAbility = ability;
	};
</script>

<section in:fade={{ delay: 200 }} id="stats-abilities">
	{#each abilities as ability, i (i)}
		<button
			type="button"
			id="ability-{ability.id}"
			class:chosen={ability.id === chosenAbility.id}
			on:click={() => setAbility(ability)}
		>
			<span>
				{ability.names.find((x) => x.language.name === $lang)?.name}
			</span>
			{#if ability.id === chosenAbility.id}
				<section>
					{ability.flavor_text_entries.find((x) => x.language.name === $lang)?.flavor_text}
				</section>
			{/if}
		</button>
	{/each}
</section>

<style>
	#stats-abilities {
		display: grid;
		place-items: center;
		gap: var(--small-gap);
		padding: 1em;
		border-radius: 0 var(--border-r-200) var(--border-r-50) var(--border-r-200);
		background-color: var(--background-color);
		box-shadow: var(--box-shadow);
	}

	@media (max-width: 414px) {
		#stats-abilities {
			border-radius: 0;
			box-shadow: none;
		}
	}

	#stats-abilities > button:last-child span {
		position: relative;
		font-style: italic;
	}

	#stats-abilities button:last-child span::before {
		content: '* ';
	}

	[id^='ability'] {
		height: 100%;
		width: 100%;
		border: none;
		font-size: x-large;
		cursor: pointer;

		transition: padding 0.2s ease-in-out;
	}

	[id^='ability']:hover {
		filter: brightness(0.8);
	}

	[id^='ability']:first-child {
		border-radius: 0 var(--border-r-100) 0 0;
	}

	[id^='ability']:last-child {
		border-radius: 0 0 0 var(--border-r-100);
	}

	[id^='ability']:only-child {
		border-radius: var(--border-r-100);
	}

	.chosen {
		padding-block: 0.5em;
		display: flex;
		gap: var(--small-gap);
		justify-content: center;
		align-items: center;
		flex-direction: column;
		transition: padding 0.2s ease-in-out;
	}

	.chosen > section {
		font-size: large;
		line-height: 1em;
	}
</style>
