import { error } from '@sveltejs/kit';
import {
    DEFAULT_POKEMON_OFFSET,
    MAX_POKEMON_LOADING
} from '$lib/constants';
import type { PageServerLoad } from "./$types";
import type { EntityRef, PokemonBulk } from '$lib/types/Pokemon';

export const load: PageServerLoad = async ({ url, fetch }) => {
    try {
        const [limit, offset] = [
            url.searchParams.get('_limit') || MAX_POKEMON_LOADING,
            url.searchParams.get('_offset') || DEFAULT_POKEMON_OFFSET
        ];
        const result: Response = await fetch(`/api/pokedex?_limit=${limit}&_offset=${offset}`);

        if (result.ok) {
            const pokemonBulk: PokemonBulk = await result.json();
            const lightkedex = pokemonBulk.results.map(async (pokemon: EntityRef) => {
                const lightcodex = await import(`$lib/assets/lightkedex.json`);
                const lightkemon = lightcodex.find((p) => `${p.id}` === pokemon.url.match(/\d+/g)[1]);
                return {
                    id: lightkemon.id,
                    name: lightkemon.name,
                    image: '',
                    types: lightkemon.types
                };
            });

            return {
                pokemonBulk: lightkedex
            };
        }
    } catch (err) {
        console.error(error);
        throw error(500, err);
    }
};
