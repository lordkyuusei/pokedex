import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (({ params, route, url }) => {
  const id = parseInt(params.id);
  if (!Number.isNaN(id) && !url.href.endsWith('stats')) {
    throw redirect(307, `stats`);
  }
}) satisfies PageServerLoad;