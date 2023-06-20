import { getAbilitiesLteGen } from '$lib/server/database/actions';
import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
    const id = Number(params.id);
    const response = await getAbilitiesLteGen(id || undefined);
    return new Response(response);

}) satisfies RequestHandler;