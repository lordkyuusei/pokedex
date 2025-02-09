import { getPokemonList } from "$lib/server/database/actions";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const game = url.searchParams.get('game');

    if (!from || !to) return { pokemonList: [] };

    const fromNbr = parseInt(from);
    const toNbr = parseInt(to);

    const pokemonList = await getPokemonList(fromNbr, toNbr, game);
    return new Response(pokemonList);
}