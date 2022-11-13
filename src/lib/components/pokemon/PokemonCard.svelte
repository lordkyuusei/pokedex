<script lang="ts">
	import PokemonType from '../shared/PokemonType.svelte';
	import POKEMON_TYPES from '$lib/store/types';
	import Card from '../barebone/Card.svelte';
	import { fetchPokemonSpriteURL, fetchPokemonShinySpriteURL } from '$lib/api';
	import { beforeUpdate } from 'svelte';

	export let id: string = '';
	export let name: string = '';
	export let picture: string = '';
	export let types: string[] = [];
	export let isLink: boolean = false;

	const showShiny = () => (picture = fetchPokemonShinySpriteURL(id));
	const showRegular = () => (picture = fetchPokemonSpriteURL(id));

	const drawCardBackground = (types: string[]) => {
		if (types.length > 0) {
			const [fType, sType] = types.map(
				(type) => POKEMON_TYPES.filter((ref) => ref.name === type.toLowerCase())[0].color
			);
			return sType
				? `linear-gradient(90deg, ${fType} 0%, ${sType} 100%)`
				: `radial-gradient(circle, ${fType} 50%, ${fType.replace('0.69', '1')} 100%)`;
		} else {
			return `linear-gradient(90deg, #C6C6C6 0%, #A1A1A1 100%)`;
		}
	};

	const computePokemonId = (id: string) => `${id}`.padStart(3, '0');

	beforeUpdate(() => {
		if (picture.includes('undefined')) {
			picture = 'http://placekitten.com/200/200';
		}
		if (picture === '') {
			picture = fetchPokemonSpriteURL(id);
		}
	});
</script>

<Card title="N°{computePokemonId(id)}" reactive span={'md'} size={isLink ? 'md' : 'lg'}>
	<section class="pokemon-card" {id} style={`background: ${drawCardBackground(types)};`}>
		<header class="pokemon-id">
			<div class="pokemon-name">{name}</div>
			<button class="pokemon-shiny" on:mouseenter={showShiny} on:mouseleave={showRegular}>✨</button
			>
		</header>
		<div class="pokemon-picture">
			<img src={picture} alt={name} />
		</div>
		<footer class="pokemon-types">
			{#each types as type (type)}
				<PokemonType name={type} />
			{/each}
		</footer>
	</section>
</Card>

<style>
	.pokemon-card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 100%;
		border-radius: 10px;
	}

	.pokemon-id {
		display: grid;
		grid-template-columns: 1fr 5fr 1fr;
		width: 100%;
		justify-content: space-evenly;
		justify-items: center;
		align-items: center;
	}

	.pokemon-name {
		grid-column: 2;
		margin: 0.5rem;
		padding: 1rem;
		font-size: 1rem;
		text-align: center;
		letter-spacing: 3px;
		font-weight: bolder;
		border-radius: 25px;
		width: fit-content;
		text-transform: capitalize;
		background-color: var(--theme-cardglass);
	}

	.pokemon-shiny {
		grid-column: 3;
		margin: 0.5rem;
		padding: 0.5rem;
		font-size: 1rem;
		text-align: center;
		border-radius: 25px;
		width: fit-content;
		border: none;
		cursor: pointer;
		background-color: var(--theme-cardglass);
	}

	.pokemon-picture {
		position: relative;
		width: 100%;
	}

	.pokemon-picture img {
		border-radius: 50px;
		background-color: var(--theme-cardglass);
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		height: 15vh;
		width: auto;
		margin: auto;
	}

	.pokemon-types {
		width: 100%;
		display: flex;
		justify-content: center;
		gap: 2em;
		padding: 0.25em 0;
	}

	@media screen and (aspect-ratio: 16/9) {
		.pokemon-picture img {
			image-rendering: pixelated;
		}
	}
</style>
