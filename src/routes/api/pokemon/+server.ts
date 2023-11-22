import { DEFAULT_LEFT_BOUNDARY, DEFAULT_RIGHT_BOUNDARY } from "$lib/constants/global";
import { getPokemonList } from "$lib/server/database/actions";
import type { RequestHandler } from "./$types";

export const GET = (async ({ url }) => {
    const from = parseInt(url.searchParams.get('from') ?? DEFAULT_LEFT_BOUNDARY);
    const to = parseInt(url.searchParams.get('to') ?? DEFAULT_RIGHT_BOUNDARY);

    const pokemonList = await getPokemonList(from, to);
    return new Response(pokemonList);
}) satisfies RequestHandler;