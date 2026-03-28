import type { PokemonType } from "./pokemonTypes";

export type PokemonAffinityType = 'double-weaknesses' | 'weaknesses' | 'resistances' | 'double-resistances' | 'immunities';
export type PokemonAffinity = {
    name: PokemonAffinityType,
    value: PokemonType[]
}