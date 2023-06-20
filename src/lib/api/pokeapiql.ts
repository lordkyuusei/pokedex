import { POKEAPI_GRAPHQL } from "$lib/constants/api.json";
import { FETCH_ALL_POKEMON, FETCH_ALL_GENERATIONS, FETCH_MOVES_COUNT_PER_GEN, FETCH_ALL_ABILITIES } from "$lib/constants/queries.json";

const fetchPokeapiGraph = async (name: string, query: string) => {
    const result = await fetch(POKEAPI_GRAPHQL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "query": query,
            "variables": null,
            "operationName": name,
        })
    })

    if (!result.ok) return [];

    const output = await result.json();

    if (output.errors) {
        console.error(output.errors)
        return []
    }

    return output;
}

export const fetchPokemonList = async () => fetchPokeapiGraph("FetchAllPokemon", FETCH_ALL_POKEMON);
export const fetchGenerationsList = async () => fetchPokeapiGraph("FetchAllGenerations", FETCH_ALL_GENERATIONS);
export const fetchMovesList = async () => fetchPokeapiGraph("FetchAllMoves", FETCH_MOVES_COUNT_PER_GEN);
export const fetchAbilitiesList = async () => fetchPokeapiGraph("FetchAllAbilities", FETCH_ALL_ABILITIES);

