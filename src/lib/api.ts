import { browser, dev } from '$app/environment';
import type { Pokemon, PokemonBulk } from './types/Pokemon';
import type { PokemonAbility } from './types/PokemonAbility';
import type { PokemonEvolution } from './types/PokemonEvolutionChain';
import type { PokemonForm } from './types/PokemonForm';
import type { PokemonSpecie } from './types/PokemonSpecie';
import type { PokemonMove } from './types/PokemonMove';
import { freeStorage, isStorageFull } from './storageLibrary';

import { BASE_URL, SPRITE_URL, ITEMS_URL } from './constants';
import type { PokemonLocation } from './types/PokemonLocation';
import type { LocationArea } from './types/LocationArea';

const fetchPokeApi = async (url: string): Promise<any> =>
	await fetch(url, { method: 'GET', headers: {}, body: null })
		.then((response) => response.json())
		.catch((reason) => new Error(`Error: ${reason}`));

const fetchCacheOrApi = async (url: string): Promise<any> => {
	if (browser) {
		const cache = localStorage.getItem(url);
		if (cache) {
			if (dev) console.log(`Fetching ${url.split('/').pop()} from cache`);
			return JSON.parse(cache);
		} else {
			if (dev) console.log(`Fetching ${url.split('/').pop()} from API`);
			const data = await fetchPokeApi(url);
			const length = JSON.stringify(data).length;
			if (isStorageFull(length)) {
				if (dev) console.log('Storage is full, clearing it');
				freeStorage(length)
			}
			localStorage.setItem(url, JSON.stringify(data));
			return data;
		}
	} else {
		console.log(`SSR: Fetching ${url.split('/').pop()} from API`);
		return fetchPokeApi(url);
	}
}
export const fetchItemSpriteURL = (id: string): string => `${ITEMS_URL}${id}.png`;

export const fetchPokemonSpriteURL = (
	id: string,
	version?: string,
	generation?: string,
	orientation?: string
): string => {
	const specific = version && generation ? `/versions/${generation}/${version}` : '';
	return `${SPRITE_URL}${specific}${orientation || ''}/${id}.png`;
};

export const fetchPokemonShinySpriteURL = (
	id: string,
	version?: string,
	generation?: string,
	orientation?: string
): string => {
	const specific = version && generation ? `/versions/${generation}/${version}` : '';
	return `${SPRITE_URL}${specific}${orientation || ''}/shiny/${id}.png`;
};

export const fetchPokemonMove = async (id: string): Promise<PokemonMove> =>
	await fetchCacheOrApi(`${BASE_URL}/move/${id}`);

export const fetchPokemonForm = async (id: string): Promise<PokemonForm> =>
	await fetchCacheOrApi(`${BASE_URL}/pokemon-form/${id}`);

export const fetchPokemonAbility = async (id: string): Promise<PokemonAbility> =>
	await fetchCacheOrApi(`${BASE_URL}/ability/${id}`);

export const fetchPokemonEvolutionChain = async (id: string): Promise<PokemonEvolution> =>
	await fetchCacheOrApi(`${BASE_URL}/evolution-chain/${id}`);

export const fetchPokemonSpecie = async (specieName: string): Promise<PokemonSpecie> =>
	await fetchCacheOrApi(`${BASE_URL}/pokemon-species/${specieName}`);

export const fetchPokemonLocation = async (id: string): Promise<PokemonLocation> =>
	await fetchCacheOrApi(`${BASE_URL}/location/${id}`);

export const fetchPokemonLocationArea = async (id: string | number): Promise<LocationArea[]> =>
	await fetchCacheOrApi(`${BASE_URL}/pokemon/${id}/encounters`);

export const fetchPokemonBulk = async (
	limit: number = 30,
	offset: number = 0
): Promise<PokemonBulk> => await fetchCacheOrApi(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

export const fetchPokemonInfo = async (pokemonInfo: number | string): Promise<Pokemon> =>
	await fetchCacheOrApi(`${BASE_URL}/pokemon/${pokemonInfo}`);
