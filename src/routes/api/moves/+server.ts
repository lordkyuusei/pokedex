import { getMoves } from '$lib/server/database/actions';
import type { RequestHandler } from "./$types";

export const GET = (async ({ url }) => {
    const generationId = parseInt(url.searchParams.get('generation') || '1');
    const movesNamesParam = url.searchParams.get('moves') || '';

    const movesNames = movesNamesParam.split(',');

    const moves = await getMoves(generationId, movesNames);
    return new Response(JSON.stringify(moves));

}) satisfies RequestHandler;