import { fetchPokemonAbility } from '$lib/server/api/fetch';
import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
    const id = Number(params.id);

    const abilityDetails = await fetchPokemonAbility(params.id);

    const move = JSON.stringify(abilityDetails)
    return new Response(move);

}) satisfies RequestHandler;