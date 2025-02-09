import { fetchPokemonMove } from '$lib/server/api/fetch';
import { getMove } from '$lib/server/database/actions';
import type { LightMove } from '$lib/types/lightmove';
import type { PokemonMove } from '$lib/types/pokeapi/move';
import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
    const id = Number(params.id);

    const moveLight: LightMove = JSON.parse(await getMove(id));
    const moveDetails: PokemonMove | null = await fetchPokemonMove(params.id);

    const move = JSON.stringify({ moveLight, moveDetails })
    return new Response(move);

}) satisfies RequestHandler;