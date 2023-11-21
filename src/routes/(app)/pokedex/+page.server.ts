import { getPokemonList } from "$lib/server/database/actions";
import type { PageServerLoad } from "./$types";
import { DEFAULT_LEFT_BOUNDARY, DEFAULT_RIGHT_BOUNDARY } from "$lib/constants/global";

export const load = (async ({ url }) => {
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    if (!from || !to) return { pokemonList: [] };

    const fromNbr = parseInt(from);
    const toNbr = parseInt(to);

    const pokemonList = JSON.parse(await getPokemonList(fromNbr, toNbr));

    return {
        pokemonList
    }
}) satisfies PageServerLoad