import { getAbilities } from '$lib/server/database/actions';
import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
    const response = await getAbilities();
    return new Response(response);

}) satisfies RequestHandler;