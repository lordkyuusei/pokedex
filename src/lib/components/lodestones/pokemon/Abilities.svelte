<script lang="ts">
	import { lang } from '$lib/store/lang';
	import { fade } from 'svelte/transition';

	import type { PokemonAbility } from '$lib/types/pokeapi/ability';
	import { goto } from '$app/navigation';

	export let abilities: PokemonAbility[] = [];


	const getAbilityTexts = (ability: PokemonAbility, lang: string) => {
		const { names, flavor_text_entries: flavors, effect_entries: effects } = ability;

		const name = names.find(name => name.language.name === lang)?.name ?? names[1]?.name;
		const desc = flavors.find(name => name.language.name === lang)?.flavor_text ?? flavors[1]?.flavor_text;
		const effect = effects.find(eff => eff.language.name === lang)?.effect ?? effects[1]?.effect;

		return { name, desc, effect };
	}

</script>

<section id="stats-abilities" in:fade={{ delay: 200 }}>
	{#each abilities as ability, i (ability.id)}
		{@const texts = getAbilityTexts(ability, $lang)}
		<button
			id="ability-{ability.id}"
			class="ability-button"
			class:hidden={i === abilities.length - 1}
			data-ability-name="{texts.name}"
			on:click={() => goto(`/abilities/${ability.id}`)}
		>
		<span class="desc">{texts.desc}</span>
		<span class="effect">{texts.effect}</span>
	</button>
	{/each}
</section>

<style>
	section#stats-abilities {
		position: relative;
		display: grid;
		grid-auto-flow: row;
		grid-auto-rows: 1fr;
		gap: var(--small-gap);

		overflow-y: auto;
		padding: var(--small-gap);
		background-color: var(--background-second-color);
		border-radius: 0 var(--border-r-200) var(--border-r-100) var(--border-r-200);

		& > button.ability-button {
			&:first-child {
				border-radius: 0 calc(var(--border-r-200) - var(--small-gap)) 0 0;
			}

			&:last-child {
				border-radius: 0 0 calc(var(--border-r-100) - var(--small-gap)) calc(var(--border-r-200) - var(--small-gap));
			}

			&:only-child {
				border-radius: 0 calc(var(--border-r-200) - var(--small-gap)) calc(var(--border-r-100) - var(--small-gap)) calc(var(--border-r-200) - var(--small-gap));
			}

			&.hidden::before {
				font-style: italic;
			}

			& > span.effect {
				font-size: smaller;

				&::before {
					content: "« "
				}

				&::after {
					content: " »"
				}
			}


			&:not(:hover) {
				& > span.effect {
					display: none;
				}
			}

			&:hover {
				& > span.desc {
					display: none;
				}
			}

			&::before {
				content: attr(data-ability-name);
				position: absolute;
				top: calc(calc(var(--smaller-gap) * -1) - var(--smallest-gap));
				left: var(--smaller-gap);
				color: var(--background-color);
				padding: var(--smallest-gap) var(--small-gap);
				border: 1px solid var(--text-color);
				border-radius: var(--small-gap);
				background-color: var(--text-color);
			}			
		}
	}
</style>
