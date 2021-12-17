<script lang="ts">
	import PokemonType from './PokemonType.svelte';
	import POKEMON_TYPES from '$lib/store/types';

	export let id: string = '';
	export let name: string = 'Missing';
	export let picture: string = 'Missing';
	export let types: string[] = [];

	const drawCardBackground = (types: string[]) => {
		const [fType, sType] = types.map(
			(type) => POKEMON_TYPES.filter((ref) => ref.name === type.toLowerCase())[0].color
		);
		return sType
			? `linear-gradient(90deg, ${fType} 0%, ${sType} 100%)`
			: `radial-gradient(circle, ${fType} 50%, ${fType.replace('0.69', '1')} 100%)`;
	};

	const computePokemonId = (id: string) => `${id}`.padStart(3, '0');
</script>

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

<style scoped>
	.pokemon-card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		height: 40vh;
		width: 20vw;
		transition: 0.3s;
		cursor: pointer;
		margin: 10px;
		padding: 5px;
		border-radius: 10px;
		border: 1px solid black;
		box-shadow: var(--theme-shadow);
	}

	@media (max-width: 1350px) and (min-width: 601px) {
		.pokemon-card {
			width: 40vw;
		}
	}

	@media (max-width: 600px) and (min-width: 480px) {
		.pokemon-card {
			width: 45vw;
		}
	}

	@media (max-width: 479px) {
		.pokemon-card {
			width: 80vw;
			min-width: 80vw;
		}
	}

	.pokemon-card:hover {
		transform: translateY(-5px);
		box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
	}

	.pokemon-id {
		display: grid;
		grid-template-columns: 30% auto 30%;
		width: 100%;
		justify-content: space-evenly;
		justify-items: center;
		align-items: center;
	}

	.pokemon-name {
		margin: 10px;
		padding: 10px;
		font-size: 18px;
		text-align: center;
		letter-spacing: 2px;
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
