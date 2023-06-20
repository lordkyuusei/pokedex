import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, params }) => {
    const res = await fetch(`/api/location/${params.id}`);
    const location = await res.json();
    return { location }
}) satisfies PageServerLoad;