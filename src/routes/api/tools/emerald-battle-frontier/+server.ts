import { deleteEmeraldBattleFrontierList, getEmeraldBattleFrontierList, getPokemonList, setEmeraldBattleFrontierList } from "$lib/server/database/actions";
import type { Lightkemon } from "$lib/types/lightkemon";
import { error, json, text } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { FactoryPokemon } from "$lib/types/battle-factory";

export const GET = (async ({ url, fetch }) => {
    const base = 'https://uc103433feb6fb779067e0929fd6.previews.dropboxusercontent.com/p/xls_html';
    const suffix = 'p.html?is_prewarmed=true';
    const documentID = url.searchParams.get('id');

    const battleFrontierList: string = await getEmeraldBattleFrontierList();

    if (!documentID) {
        return json({ battleFrontierList, battleFrontierSheet: null, pokemonReferences: [] });
    } else {
        const location = await fetch(`${base}/${documentID}/${suffix}`);
        if (!location || !location.ok) return error(404);
    
        const battleFrontierSheet = await location.text();
        const pokemonReferences: string = await getPokemonList(0, 386, null);
        return json({ battleFrontierList, battleFrontierSheet, pokemonReferences });
    }

}) satisfies RequestHandler;

export const POST = async ({ request }) => {
    const list: FactoryPokemon[] = await request.json();

    const result = await setEmeraldBattleFrontierList(list);
    return new Response(result);
}

export const DELETE = async () => {
    await deleteEmeraldBattleFrontierList();
    return new Response();
}