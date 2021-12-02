import type { Response } from "node-fetch";
import type { Pokemon, PokemonBulk } from "../store/types/Pokemon";

const baseURL = "https://pokeapi.co/api/v2";

export const fetchPokemonBulk = async (limit: number = 30, offset: number = 0): Promise<PokemonBulk> =>
    await fetchPokeApi(`${baseURL}/pokemon?limit=${limit}&offset=${offset}`);

export const fetchPokemonInfo = async (pokemonInfo: number | string): Promise<Pokemon> =>
    await fetchPokeApi(`${baseURL}/pokemon/${pokemonInfo}`);

const fetchPokeApi = async (url: string): Promise<any> => 
    await fetch(url, { method: "GET", headers: {}, body: null })
        .then((response) => response.json())
        .catch((reason) => new Error(`Error: ${reason}`));