import { searchPokemonById, searchPokemonByName } from '$lib/server/database/actions';
import type { RequestHandler } from "./$types";

export const GET = (async ({ url }) => {
    const input = url.searchParams.get('input') ?? "";
    const type = url.searchParams.get('type') ?? "";

    const id = parseInt(input);
    return Number.isNaN(id) ?
        new Response(await searchPokemonByName(input)) :
        new Response(await searchPokemonById(id));

}) satisfies RequestHandler;