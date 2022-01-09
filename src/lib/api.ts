import { browser } from '$app/env';
import type { Pokemon, PokemonBulk } from './types/Pokemon';
import type { PokemonAbility } from './types/PokemonAbility';
import type { PokemonEvolution } from './types/PokemonEvolutionChain';
import type { PokemonForm } from './types/PokemonForm';
import type { PokemonSpecie } from './types/PokemonSpecie';

const baseURL = 'https://pokeapi.co/api/v2';
const spriteURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
const itemsURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/';

const fetchPokeApi = async (url: string): Promise<any> =>
	await fetch(url, { method: 'GET', headers: {}, body: null })
		.then((response) => response.json())
		.catch((reason) => new Error(`Error: ${reason}`));

const fetchCacheOrApi = async (url: string): Promise<any> => {
	if (browser) {
		const cache = localStorage.getItem(url);
		if (cache) {
			return JSON.parse(cache);
		} else {
			const data = await fetchPokeApi(url);
			localStorage.setItem(url, JSON.stringify(data));
			return data;
		}
	} else {
		return fetchPokeApi(url);
	}
}
export const fetchItemSpriteURL = (id: string): string => `${itemsURL}${id}.png`;

export const fetchPokemonSpriteURL = (
	id: string,
	version?: string,
	generation?: string,
	orientation?: string
): string => {
	const specific = version && generation ? `${version}/${generation}/` : '';
	return `${spriteURL}${specific}${orientation || ''}/${id}.png`;
};

export const fetchPokemonForm = async (id: string): Promise<PokemonForm> =>
	await fetchCacheOrApi(`${baseURL}/pokemon-form/${id}`);

export const fetchPokemonAbility = async (id: string): Promise<PokemonAbility> =>
	await fetchCacheOrApi(`${baseURL}/ability/${id}`);

export const fetchPokemonEvolutionChain = async (id: string): Promise<PokemonEvolution> =>
	await fetchCacheOrApi(`${baseURL}/evolution-chain/${id}`);

export const fetchPokemonSpecie = async (specieName: string): Promise<PokemonSpecie> =>
	await fetchCacheOrApi(`${baseURL}/pokemon-species/${specieName}`);

export const fetchPokemonBulk = async (
	limit: number = 30,
	offset: number = 0
): Promise<PokemonBulk> => await fetchCacheOrApi(`${baseURL}/pokemon?limit=${limit}&offset=${offset}`);

export const fetchPokemonInfo = async (pokemonInfo: number | string): Promise<Pokemon> =>
	await fetchCacheOrApi(`${baseURL}/pokemon/${pokemonInfo}`);
