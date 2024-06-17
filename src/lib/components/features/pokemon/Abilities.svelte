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

<div in:fade={{ delay: 200 }} id="stats-abilities">
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
				<span class="flavor">
					{ability.flavor_text_entries.find((x) => x.language.name === $lang)?.flavor_text}
				</span>
			{/if}
		</button>
	{/each}
</div>

<style>
	div#stats-abilities {
		display: grid;
		place-items: center;
		gap: var(--small-gap);
		padding: var(--small-gap);
		border-radius: 0 var(--border-r-200) var(--border-r-50) var(--border-r-200);
		background-color: var(--background-second-color);
		box-shadow: var(--box-shadow);

		& > button[id^='ability'] {
			height: 100%;
			width: 100%;
			font-size: x-large;
			cursor: pointer;

			color: var(--text-color);
			background-color: var(--background-color);
			transition: padding-block var(--transition-duration) var(--transition-function);
		}

		& > button[id^='ability']:first-child {
			border-radius: 0 var(--border-r-100) 0 0;
		}

		& > button[id^='ability']:last-child {
			border-radius: 0 0 0 var(--border-r-100);

			& > span {
				position: relative;
				font-style: italic;

				& > ::before {
					content: '* ';
				}
			}
		}

		& > button[id^='ability']:only-child {
			border-radius: var(--border-r-100);
		}

		& > button.chosen {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: var(--small-gap);
			padding-block: var(--smaller-gap);
			transition: padding var(--transition-duration) var(--transition-function);
		}

		& > button.chosen > span.flavor {
			font-size: large;
			line-height: 1em;
		}
	}

	@media (max-width: 640px) {
		div#stats-abilities {
			border-radius: 0;
			box-shadow: none;
		}
	}
</style>
