import { POKEAPI_ENDPOINT } from "$lib/constants/api.json";
import type { PokemonAbility } from "$lib/types/pokeapi/ability";
import type { PokemonEvolution } from "$lib/types/pokeapi/evolution";
import type { PokemonLocation } from "$lib/types/pokeapi/location";
import type { PokemonLocationArea } from "$lib/types/pokeapi/location-area";
import type { PokemonMove } from "$lib/types/pokeapi/move";
import type { Pokemon } from "$lib/types/pokeapi/pokemon";
import type { PokemonSpecie } from "$lib/types/pokeapi/specie";

const fetchPokeApi = async <T>(url: string, svelteFetch: any = null): Promise<T | null> => {
    const func = svelteFetch ?? fetch;

    try {
        const response = await func(url, { method: 'GET', headers: {}, body: null });

        if (response.ok) {
            return response.json();
        } else {
            console.error("error", response.status, response.statusText);
        }
    } catch (e) {
        console.error(e);
    }

    return null;
}

export const fetchPokemonEvolutionChain = async (id: string): Promise<PokemonEvolution | null> =>
    await fetchPokeApi<PokemonEvolution>(`${POKEAPI_ENDPOINT}/evolution-chain/${id}`);

export const fetchPokemonMove = async (id: string, svelteFetch: any = null): Promise<PokemonMove | null> =>
    await fetchPokeApi<PokemonMove>(`${POKEAPI_ENDPOINT}/move/${id}`, svelteFetch);

export const fetchPokemonAbility = async (nameOrId: string): Promise<PokemonAbility | null> =>
    await fetchPokeApi<PokemonAbility>(`${POKEAPI_ENDPOINT}/ability/${nameOrId}`);

export const fetchPokemonSpecieByName = async (specieName: string): Promise<PokemonSpecie | null> =>
    await fetchPokeApi<PokemonSpecie>(`${POKEAPI_ENDPOINT}/pokemon-species/${specieName}`);

export const fetchPokemonById = async (id: number | string): Promise<Pokemon | null> =>
    await fetchPokeApi<Pokemon>(`${POKEAPI_ENDPOINT}/pokemon/${id}`);

export const fetchPokemonLocation = async (id: number): Promise<PokemonLocation | null> =>
    await fetchPokeApi<PokemonLocation>(`${POKEAPI_ENDPOINT}/location/${id}`);

export const fetchPokemonLocationArea = async (id: number): Promise<PokemonLocationArea[] | null> =>
    await fetchPokeApi<PokemonLocationArea[]>(`${POKEAPI_ENDPOINT}/pokemon/${id}/encounters`);