import { fetchPokemonAbility } from "$lib/api/fetch";
import type { PageServerLoad } from "./$types";

export const load = (async ({ parent }) => {
    const { pokemon } = await parent();

    const abilities = pokemon.abilities.map(async (a) =>
        await fetchPokemonAbility(a.ability.name)
    );

    return {
        abilities: await Promise.all(abilities)
    }
}) satisfies PageServerLoad;