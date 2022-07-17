import * as pokeapi from '$lib/api';

export const GET = async ({ params }) => {
	const { id } = params;
	const pokemon = await pokeapi.fetchPokemonInfo(id);
	const { name } = pokemon?.species || { name: 'uknown' };
	const specie = await pokeapi.fetchPokemonSpecie(name);

	return {
		body: {
			pokemon,
			specie
		}
	};
};
