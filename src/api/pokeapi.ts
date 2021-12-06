import type { Response } from "node-fetch";
import type { Pokemon, PokemonBulk } from "../store/types/Pokemon";
import type { PokemonEvolution } from "../store/types/PokemonEvolution";
import type { PokemonSpecie } from '../store/types/PokemonSpecie';

const baseURL = "https://pokeapi.co/api/v2";
const spriteURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

export const fetchPokemonSpriteURL = (id: string, version?: string, generation?: string, orientation?: string): string => {
    const specific = version && generation ? `${version}/${generation}/` : "";
    return `${spriteURL}${specific}${orientation}/${id}.png`;
}

export const fetchPokemonEvolutionChain = async (id: string): Promise<PokemonEvolution> => 
    await fetchPokeApi(`${baseURL}/evolution-chain/${id}`);

export const fetchPokemonSpecie = async (specieName: string): Promise<PokemonSpecie> =>
    await fetchPokeApi(`${baseURL}/pokemon-species/${specieName}`);

export const fetchPokemonBulk = async (limit: number = 30, offset: number = 0): Promise<PokemonBulk> =>
    await fetchPokeApi(`${baseURL}/pokemon?limit=${limit}&offset=${offset}`);

export const fetchPokemonInfo = async (pokemonInfo: number | string): Promise<Pokemon> =>
    await fetchPokeApi(`${baseURL}/pokemon/${pokemonInfo}`);

const fetchPokeApi = async (url: string): Promise<any> =>
    await fetch(url, { method: "GET", headers: {}, body: null })
        .then((response) => response.json())
        .catch((reason) => new Error(`Error: ${reason}`));