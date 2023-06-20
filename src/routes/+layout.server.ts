import { getGenerationsList } from "$lib/server/database/actions";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    const generationsList = JSON.parse(await getGenerationsList());
    const { mobile } = locals;

    return {
        generationsList,
        mobile
    }
}) satisfies LayoutServerLoad