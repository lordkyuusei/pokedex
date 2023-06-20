import { fetchPokemonMove } from '$lib/api/fetch';
import { getMove } from '$lib/server/database/actions';
import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
    const id = Number(params.id);

    const moveLight = JSON.parse(await getMove(id));
    const moveDetails = await fetchPokemonMove(params.id);

    const move = JSON.stringify({ moveLight, moveDetails })
    return new Response(move);

}) satisfies RequestHandler;