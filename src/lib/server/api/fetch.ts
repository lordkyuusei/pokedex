import { POKEAPI_ENDPOINT } from "$lib/constants/api.json";
import type { PokemonAbility } from "$lib/types/pokeapi/ability";
import type { PokemonEvolution } from "$lib/types/pokeapi/evolution";
import type { PokemonLocation } from "$lib/types/pokeapi/location";
import type { PokemonLocationArea } from "$lib/types/pokeapi/location-area";
import type { PokemonMove } from "$lib/types/pokeapi/move";
import type { Pokemon } from "$lib/types/pokeapi/pokemon";
import type { PokemonSpecie } from "$lib/types/pokeapi/specie";

const fetchPokeApi = async <T>(url: string, svelteFetch: any = null): Promise<T | undefined> => {
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
}

export const fetchPokemonEvolutionChain = async (id: string): Promise<PokemonEvolution | undefined> =>
    await fetchPokeApi<PokemonEvolution>(`${POKEAPI_ENDPOINT}/evolution-chain/${id}`);

export const fetchPokemonMove = async (id: string, svelteFetch: any = null): Promise<PokemonMove | undefined> =>
    await fetchPokeApi(`${POKEAPI_ENDPOINT}/move/${id}`, svelteFetch);

export const fetchPokemonAbility = async (nameOrId: string): Promise<PokemonAbility | undefined> =>
    await fetchPokeApi(`${POKEAPI_ENDPOINT}/ability/${nameOrId}`);

export const fetchPokemonSpecieByName = async (specieName: string): Promise<PokemonSpecie | undefined> =>
    await fetchPokeApi(`${POKEAPI_ENDPOINT}/pokemon-species/${specieName}`);

export const fetchPokemonById = async (id: number): Promise<Pokemon | undefined> =>
    await fetchPokeApi(`${POKEAPI_ENDPOINT}/pokemon/${id}`);

export const fetchPokemonLocation = async (id: number): Promise<PokemonLocation | undefined> =>
    await fetchPokeApi(`${POKEAPI_ENDPOINT}/location/${id}`);

export const fetchPokemonLocationArea = async (id: number): Promise<PokemonLocationArea[] | undefined> =>
    await fetchPokeApi(`${POKEAPI_ENDPOINT}/pokemon/${id}/encounters`);