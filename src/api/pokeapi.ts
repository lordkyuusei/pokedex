import type { Response } from "node-fetch";
import type { Pokemon } from "../store/types/Pokemon";

const baseURL = "https://pokeapi.co/api/v2";

// fetchPokemonInfo("ditto");

export const fetchPokemonBulk = async (limit: number = 30, offset: number = 0) =>
    await fetchPokeApi(`${baseURL}/pokemon?limit=${limit}&offset=${offset}`);

export const fetchPokemonInfo = async (pokemonInfo: number | string): Promise<Pokemon> =>
    await fetchPokeApi(`${baseURL}/pokemon/${pokemonInfo}`);

const fetchPokeApi = async (url: string, method: string = "GET", headers: any = {}, body: any = null) => {
    const result: any = await window.fetch(url, { method, headers, body })
        .then((response) => response.json())
        .catch((reason) => new Error(`Error: ${reason}`));;
    return result;
}