import { getGenerationsList } from "$lib/server/database/actions";
import type { Generation } from "$lib/types/generation";
import type { LayoutServerLoad } from "./$types";

export const load = (async (params) => {
    const generationsList: Generation[] = JSON.parse(await getGenerationsList());

    return {
        generationsList,
    }
}) satisfies LayoutServerLoad