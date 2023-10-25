import { getAbilitiesLteGen } from '$lib/server/database/actions';
import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
    const response = await getAbilitiesLteGen();
    return new Response(response);

}) satisfies RequestHandler;