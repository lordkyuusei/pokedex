import type { Generation } from "$lib/types/generation";
import type { PokemonAbility } from "$lib/types/pokeapi/ability";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, fetch, parent }) => {
    const { generationsList }: { generationsList: Generation[] } = await parent();
    const result = await fetch(`/api/abilities/${params.id}`);
    const ability: PokemonAbility = await result.json();

    return {
        ability,
        generationsList
    }
}) satisfies PageServerLoad