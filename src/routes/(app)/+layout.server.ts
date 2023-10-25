import { getGenerationsList } from "$lib/server/database/actions";
import type { LayoutServerLoad } from "../$types";

export const load = (async (params) => {
    const generationsList = JSON.parse(await getGenerationsList());

    return {
        generationsList,
    }
}) satisfies LayoutServerLoad