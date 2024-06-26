import { setDefaultMapNameForLocation } from '$lib/server/database/actions';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from "./$types";
import type { LocationNode } from '$lib/types/location';

export const POST = (async ({ params, request }) => {
    const { version } = params;
    const body: LocationNode = await request.json();

    await setDefaultMapNameForLocation(body);

    return json(body);
}) satisfies RequestHandler;