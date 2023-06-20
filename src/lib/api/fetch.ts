import { SPRITE_URL, POKEAPI_ENDPOINT } from "$lib/constants/api.json";
import type { PokemonAbility } from "$lib/types/pokeapi/ability";
import type { PokemonEvolution } from "$lib/types/pokeapi/evolution";
import type { PokemonLocation } from "$lib/types/pokeapi/location";
import type { PokemonLocationArea } from "$lib/types/pokeapi/location-area";
import type { PokemonMove } from "$lib/types/pokeapi/move";
import type { Pokemon } from "$lib/types/pokeapi/pokemon";
import type { PokemonSpecie } from "$lib/types/pokeapi/specie";

const fetchPokeApi = async (url: string, svelteFetch: any = null): Promise<any> => {
    const func = svelteFetch ?? fetch;
    const response = await func(url, { method: 'GET', headers: {}, body: null });

    if (response.ok) {
        return response.json();
    } else {
        console.error("error", response.status, response.statusText);
    }
}

export const fetchPokemonEvolutionChain = async (id: string): Promise<PokemonEvolution> =>
    await fetchPokeApi(`${POKEAPI_ENDPOINT}/evolution-chain/${id}`);

export const fetchPokemonMove = async (id: string, svelteFetch: any = null): Promise<PokemonMove> =>
    await fetchPokeApi(`${POKEAPI_ENDPOINT}/move/${id}`, svelteFetch);

export const fetchPokemonAbility = async (nameOrId: string): Promise<PokemonAbility> =>
    await fetchPokeApi(`${POKEAPI_ENDPOINT}/ability/${nameOrId}`);

export const fetchPokemonSpecieByName = async (specieName: string): Promise<PokemonSpecie> =>
    await fetchPokeApi(`${POKEAPI_ENDPOINT}/pokemon-species/${specieName}`);

export const fetchPokemonById = async (id: number): Promise<Pokemon> =>
    await fetchPokeApi(`${POKEAPI_ENDPOINT}/pokemon/${id}`);

export const fetchPokemonLocation = async (id: number): Promise<PokemonLocation> =>
    await fetchPokeApi(`${POKEAPI_ENDPOINT}/location/${id}`);

export const fetchPokemonLocationArea = async (id: number): Promise<PokemonLocationArea[]> =>
    await fetchPokeApi(`${POKEAPI_ENDPOINT}/pokemon/${id}/encounters`);

export const fetchPokemonSpriteURL = (
    id: number,
    version?: string,
    generation?: string,
    orientation?: string
): string => {
    const specific = version && generation ? `/versions/${generation}/${version}` : '';
    return `${SPRITE_URL}${specific}${orientation || ''}/${id}.png`;
};

export const fetchPokemonShinySpriteURL = (
    id: number,
    version?: string,
    generation?: string,
    orientation?: string
): string => {
    const specific = version && generation ? `/versions/${generation}/${version}` : '';
    return `${SPRITE_URL}${specific}${orientation || ''}/shiny/${id}.png`;
};