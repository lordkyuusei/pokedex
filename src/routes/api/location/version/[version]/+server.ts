import { getLocationsFromVersion } from '$lib/server/database/actions';
import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
    const { version } = params;

    const locations: string = await getLocationsFromVersion(version);
    return new Response(locations);

}) satisfies RequestHandler;