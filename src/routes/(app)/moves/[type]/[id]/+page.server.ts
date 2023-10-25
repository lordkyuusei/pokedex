import type { PageServerLoad } from "./$types";

export const load = (async ({ params, fetch }) => {
    const result = await fetch(`/api/moves/${params.id}`);
    const { moveLight, moveDetails } = await result.json();

    return {
        moveLight,
        moveDetails
    }
}) satisfies PageServerLoad