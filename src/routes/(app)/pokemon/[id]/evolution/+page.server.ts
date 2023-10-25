import { fetchPokemonEvolutionChain } from "$lib/server/api/fetch";
import type { PageServerLoad } from "./$types";

export const load = (async ({ parent }) => {
    const { specie } = await parent();

    const evolutionChain: string = specie.evolution_chain.url;
    const pokemonId = evolutionChain.match(/\d+/g)?.at(-1) ?? '0';
    const evolution = await fetchPokemonEvolutionChain(pokemonId);

    return {
        evolution,
    }
}) satisfies PageServerLoad;