import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (({ params, route, url }) => {
    console.log(params, route, url);

    const id = parseInt(params.id);
    if (!Number.isNaN(id) && !route.id.endsWith('stats')) {
        throw redirect(307, `stats`);
    }
}) satisfies PageServerLoad;