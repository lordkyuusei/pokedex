import { getMoveTypesGeneration } from '$lib/server/database/actions';
import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
    const id = Number(params.id);
    const response = await getMoveTypesGeneration(id || undefined);
    return new Response(response);

}) satisfies RequestHandler;