<script lang="ts">
	import PokemonType from './PokemonType.svelte';
	import POKEMON_TYPES from '$lib/store/types';
	import Card from './PokemonLayouts/Card.svelte';
	import { fetchPokemonSpriteURL } from '$lib/api';
	import { beforeUpdate } from 'svelte';

	export let id: string = '';
	export let name: string = '';
	export let picture: string = '';
	export let types: string[] = [];

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
		picture = fetchPokemonSpriteURL(id);
	});
</script>

<Card cover={true}>
	<div class="pokemon-card" {id} style={`background: ${drawCardBackground(types)};`}>
		<div class="pokemon-id">
			<div class="pokemon-number">N°{computePokemonId(id)}</div>
			<div class="pokemon-name">{name}</div>
		</div>
		<div class="pokemon-picture">
			<img src={picture} alt={name} />
		</div>
		<div class="pokemon-types">
			{#each types as type (type)}
				<PokemonType name={type} />
			{/each}
		</div>
	</div>
</Card>

<style scoped>
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
		grid-template-columns: 15% auto 15%;
		width: 100%;
		justify-content: space-evenly;
		justify-items: center;
		align-items: center;
	}

	.pokemon-name {
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
		image-rendering: pixelated;
	}

	.pokemon-types {
		width: 100%;
		display: flex;
		justify-content: space-around;
	}
</style>
