import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (({ params }) => {
    throw redirect(307, `stats`);
}) satisfies PageServerLoad;