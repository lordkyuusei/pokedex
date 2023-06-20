import { fetchPokemonLocationArea } from '$lib/api/fetch';
import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
    const id = Number(params.id);

    const locationArea = await fetchPokemonLocationArea(id);

    const move = JSON.stringify(locationArea)
    return new Response(move);

}) satisfies RequestHandler;