import { getMovesTypes } from '$lib/server/database/actions';
import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
    const { type } = params;
    const response = await getMovesTypes(type);
    return new Response(response);

}) satisfies RequestHandler;