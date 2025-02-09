import type { RequestHandler } from "./$types";

export const GET = (async ({ url, fetch }) => {
    const documentID = url.searchParams.get('id');
    if (!documentID) return new Response("");

    const base = 'https://uc103433feb6fb779067e0929fd6.previews.dropboxusercontent.com/p/xls_html';
    const suffix = 'p.html?is_prewarmed=true';

    const location = await fetch(`${base}/${documentID}/${suffix}`);
    if (!location || !location.ok) return new Response(null);

    return new Response(await location.text());

}) satisfies RequestHandler;