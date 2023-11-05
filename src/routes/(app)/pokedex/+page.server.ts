import { getPokemonList } from "$lib/server/database/actions";
import type { PageServerLoad } from "./$types";
import { DEFAULT_LEFT_BOUNDARY, DEFAULT_RIGHT_BOUNDARY } from "$lib/constants/global";

export const load = (async ({ url }) => {
    const from = parseInt(url.searchParams.get('from') ?? DEFAULT_LEFT_BOUNDARY);
    const to = parseInt(url.searchParams.get('to') ?? DEFAULT_RIGHT_BOUNDARY);

    const pokemonList = JSON.parse(await getPokemonList(from, to));

    return {
        pokemonList
    }
}) satisfies PageServerLoad