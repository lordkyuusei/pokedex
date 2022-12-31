<script lang="ts">
	import { onMount } from 'svelte';

	import POKEMON_TYPES from '$lib/store/types';
	import type { PokemonType } from '$lib/types/PokemonType';
	import { t } from '$lib/store/i18n/i18n';

	export let name = POKEMON_TYPES[0].name;
	let pokemonType: PokemonType = POKEMON_TYPES[0];

	onMount(() => {
		const type = POKEMON_TYPES.filter((type) => type.name === name.toLowerCase())[0];
		if (type !== undefined) {
			pokemonType = type;
		}
	});
</script>

<section
	class="pokemon-type"
	title={$t(`type.${pokemonType?.name}`)}
	style={`background-color: ${pokemonType?.color};`}
>
	<section class="pokemon-icon">{pokemonType?.icon}</section>
	<section class="pokemon-typename">{$t(`type.${pokemonType?.name}`)}</section>
</section>

<style>
	.pokemon-type {
		display: grid;
		grid-template-columns: 1em auto;
		gap: 1em;
		padding: 0.25em 0.5em;
		border: 1px solid black;
		border-radius: var(--theme-border-r);
		text-transform: uppercase;
		overflow: hidden;
	}

	.pokemon-icon {
		text-align: center;
		text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
		width: 100%;
	}

	.pokemon-typename {
		text-align: center;
		letter-spacing: 2px;
		text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
		color: white;
		font-weight: bolder;
	}

	@media (max-width: 425px) {
		.pokemon-type {
			font-size: 0.8em;
		}
	}
</style>
