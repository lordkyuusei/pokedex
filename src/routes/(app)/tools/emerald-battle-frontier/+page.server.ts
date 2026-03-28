import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = (async ({ fetch }) => {
    const data = await fetch('/api/tools/emerald-battle-frontier');

    return {
        battleFrontierData: await data.text(),
    }
})