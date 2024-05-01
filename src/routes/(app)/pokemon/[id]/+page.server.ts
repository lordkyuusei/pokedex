import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (({ params, route, url }) => {
    console.log(params, route, url);

    const id = parseInt(params.id);
    if (!Number.isNaN(id) && !url.href.endsWith('stats')) {
        throw redirect(307, `${id}/stats`);
    }
}) satisfies PageServerLoad;

/*

{ id: '605' } { id: '/(app)/pokemon/[id]' } URL {
  href: 'http://localhost:5173/pokemon/605',
  origin: 'http://localhost:5173',


*/