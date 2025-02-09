import type { RequestHandler } from "./$types";

export const GET = (async ({ url, fetch }) => {
    const name = url.searchParams.get('name');
    if (!name) return new Response(null);

    const location = await fetch('https://www.pokepedia.fr/' + name);
    if (!location) return new Response(null);

    return new Response(await location.text());

}) satisfies RequestHandler;