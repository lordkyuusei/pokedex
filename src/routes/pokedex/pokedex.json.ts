import * as pokeapi from '$lib/api';
import { DEFAULT_POKEMON_OFFSET, MAX_POKEMON_LOADING } from '$lib/constants';

export const GET = async ({ url }) => {
	const limit = url.searchParams.get('_limit') || MAX_POKEMON_LOADING;
	const offset = url.searchParams.get('_offset') || DEFAULT_POKEMON_OFFSET;
	try {
		const pokemonBulk = await pokeapi.fetchPokemonBulk(limit, offset);
		return {
			body: {
				pokemonBulk
			}
		};
	} catch (err) {
		console.error(err);
		return {
			body: {
				err
			}
		}
	}

};
