import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (({ params }) => {
    const id = parseInt(params.id);
    if (!Number.isNaN(id)) {
        throw redirect(307, `${id}/stats`);
    }
}) satisfies PageServerLoad;