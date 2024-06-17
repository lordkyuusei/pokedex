import { fetchPokemonLocationArea } from '$lib/server/api/fetch';
import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
    const id = Number(params.id);

    const locationArea = await fetchPokemonLocationArea(id);
    const locations = JSON.stringify(locationArea)
    return new Response(locations);

}) satisfies RequestHandler;