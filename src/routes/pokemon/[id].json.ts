import * as pokeapi from '$lib/api';

export const get = async ({ params }) => {
	const { id } = params;
	const pokemon = await pokeapi.fetchPokemonInfo(id);
	const specie = await pokeapi.fetchPokemonSpecie(pokemon.name);

	return {
		body: {
			pokemon,
			specie
		}
	};
};
