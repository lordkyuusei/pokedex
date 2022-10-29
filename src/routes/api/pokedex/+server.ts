import * as pokeapi from '$lib/api';
import { error } from '@sveltejs/kit';
import { DEFAULT_POKEMON_OFFSET, MAX_POKEMON_LOADING } from '$lib/constants';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const limit = parseInt(url.searchParams.get('_limit')) || MAX_POKEMON_LOADING;
    const offset = parseInt(url.searchParams.get('_offset')) || DEFAULT_POKEMON_OFFSET;

    try {
        const pokemonBulk = await pokeapi.fetchPokemonBulk(limit, offset);
        return new Response(JSON.stringify(pokemonBulk));
    } catch (err) {
        throw error(500, err);
    }
};
