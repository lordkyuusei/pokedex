import { searchEntityByNameOrId } from '$lib/server/database/actions';
import type { RequestHandler } from "./$types";

export const GET = (async ({ url }) => {
    const input = url.searchParams.get('input') ?? "";

    const result = await searchEntityByNameOrId(input);
    return new Response(result);
}) satisfies RequestHandler;