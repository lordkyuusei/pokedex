import type { Pokemon, PokemonBulk } from './types/Pokemon';
import type { PokemonEvolution } from './types/PokemonEvolutionChain';
import type { PokemonSpecie } from './types/PokemonSpecie';

const baseURL = 'https://pokeapi.co/api/v2';
const spriteURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
const itemsURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/';

const fetchPokeApi = async (url: string): Promise<any> =>
	await fetch(url, { method: 'GET', headers: {}, body: null })
		.then((response) => response.json())
		.catch((reason) => new Error(`Error: ${reason}`));

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

export const fetchPokemonEvolutionChain = async (id: string): Promise<PokemonEvolution> =>
	await fetchPokeApi(`${baseURL}/evolution-chain/${id}`);

export const fetchPokemonSpecie = async (specieName: string): Promise<PokemonSpecie> =>
	await fetchPokeApi(`${baseURL}/pokemon-species/${specieName}`);

export const fetchPokemonBulk = async (
	limit: number = 30,
	offset: number = 0
): Promise<PokemonBulk> => await fetchPokeApi(`${baseURL}/pokemon?limit=${limit}&offset=${offset}`);

export const fetchPokemonInfo = async (pokemonInfo: number | string): Promise<Pokemon> =>
	await fetchPokeApi(`${baseURL}/pokemon/${pokemonInfo}`);
