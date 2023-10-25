import { getPokemonList } from "$lib/server/database/actions";
import type { PageServerLoad } from "./$types";

export const load = (async ({ url }) => {
    const [arg1, arg2] = url.searchParams.values();
    const [from, to] = [parseInt(arg1) || 1, parseInt(arg2) || 100];
    const pokemonList = JSON.parse(await getPokemonList(from, to));

    return {
        pokemonList
    }
}) satisfies PageServerLoad