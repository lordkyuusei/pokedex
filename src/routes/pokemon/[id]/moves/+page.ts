import { fetchPokemonMove } from "$lib/api/fetch";
import type { PageLoad } from "./$types";

export const ssr = false;
export const load = (async ({ parent, fetch }) => {
}) satisfies PageLoad;