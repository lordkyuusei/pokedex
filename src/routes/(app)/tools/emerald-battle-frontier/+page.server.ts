import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch }) => {
    const data = await fetch('/api/tools/emerald-battle-frontier');

    return {
        battleFrontierSheet: await data.text(),
    }
}) satisfies PageServerLoad;