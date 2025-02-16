import { getLocationsFromVersion, setCoordsForLocation } from '$lib/server/database/actions';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
    const { version } = params;

    const locations: string = await getLocationsFromVersion(version);
    return new Response(locations);

}) satisfies RequestHandler;

export const POST = (async ({ params, request }) => {
    const { version } = params;
    const { locationId, area, mapName } = await request.json();

    setCoordsForLocation(locationId, area, mapName);

    return json({ locationId, area, mapName });
}) satisfies RequestHandler;