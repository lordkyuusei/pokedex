import { fetchPokemonById, fetchPokemonSpecieByName } from "$lib/server/api/fetch";
import type { LayoutServerLoad } from "./$types";

export const prerender = 'auto';
export const ssr = true;

export const load = (async ({ params }) => {
    const { id } = params;
    const pokemon = await fetchPokemonById(Number(id));

    const { name } = pokemon.species;
    const specie = await fetchPokemonSpecieByName(name);

    return {
        pokemon,
        specie
    }
}) satisfies LayoutServerLoad;