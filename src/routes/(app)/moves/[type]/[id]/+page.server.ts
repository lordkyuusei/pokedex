import type { LightMove } from "$lib/types/lightmove";
import type { PokemonMove } from "$lib/types/pokeapi/move";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, fetch }) => {
    const result = await fetch(`/api/moves/${params.id}`);
    const { moveLight, moveDetails }: { moveLight: LightMove, moveDetails: PokemonMove } = await result.json();

    return {
        moveLight,
        moveDetails
    }
}) satisfies PageServerLoad