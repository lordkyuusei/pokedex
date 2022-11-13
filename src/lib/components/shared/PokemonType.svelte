<script lang="ts">
	import { onMount } from 'svelte';

	import POKEMON_TYPES from '$lib/store/types';
	import type { PokemonType } from '$lib/types/PokemonType';
	import { t } from '$lib/store/i18n/i18n';

	export let name = '???';
	let pokemonType: PokemonType = { name, icon: '❓' };

	onMount(() => {
		const type = POKEMON_TYPES.filter((type) => type.name === name.toLowerCase())[0];
		if (type !== undefined) {
			const { color = '#FFFFFF', icon = '🤌' } = type;
			pokemonType = { name, color, icon };
		}
	});
</script>

<div class="pokemon-type" style={`background-color: ${pokemonType?.color};`}>
	<div class="pokemon-icon">{pokemonType?.icon}</div>
	<div class="pokemon-typename">{$t(`type.${pokemonType?.name}`)}</div>
</div>

<style>
	.pokemon-type {
		display: grid;
		grid-template-columns: 1em auto;
		gap: 1em;
		padding: 0.25em 0.5em;
		border: 1px solid black;
		border-radius: 1em;
		text-transform: uppercase;
	}

	.pokemon-icon {
		text-align: center;
		text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
		width: 100%;
		font-size: 1.25em;
	}

	.pokemon-typename {
		text-align: center;
		letter-spacing: 2px;
		text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
		color: white;
		font-weight: bolder;
	}
</style>
