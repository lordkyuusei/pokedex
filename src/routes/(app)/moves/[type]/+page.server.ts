import type { PageServerLoad } from "./$types";

export const load = (async ({ params, fetch }) => {
    const { type } = params;

    return {
        type,
        typesMovesList: await (await fetch(`/api/moves/type/${type}`)).json()
    }
}) satisfies PageServerLoad