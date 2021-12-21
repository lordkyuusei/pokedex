import * as pokeapi from '$lib/api';
import { DEFAULT_POKEMON_OFFSET, MAX_POKEMON_LOADING } from '$lib/constants';

export const get = async ({ query }) => {
	const limit = query.get('_limit') || MAX_POKEMON_LOADING;
	const offset = query.get('_offset') || DEFAULT_POKEMON_OFFSET;
	const pokemonBulk = await pokeapi.fetchPokemonBulk(limit, offset);

	return {
		body: {
			pokemonBulk
		}
	};
};
