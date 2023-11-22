import { fetchPokemonById, fetchPokemonSpecieByName } from "$lib/server/api/fetch";
import type { RequestHandler } from "./$types";

export const GET = (async ({ url }) => {
    const id = url.searchParams.get('name');
    if (!id) return new Response(null);

    const pokemon = await fetchPokemonById(Number(id));
    if (!pokemon) return new Response(null);

    const { name } = pokemon.species;
    const specie = await fetchPokemonSpecieByName(name);
    return new Response(JSON.stringify({ pokemon, specie }));

}) satisfies RequestHandler;