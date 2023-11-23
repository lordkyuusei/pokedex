import type { Pokemon } from "$lib/types/pokeapi/pokemon";
import type { PokemonSpecie } from "$lib/types/pokeapi/specie";

export const computeOpenGraphDescription = ({ pokemon, specie }: { pokemon: Pokemon, specie: PokemonSpecie }) => {
    const types = pokemon.types.map(type => type.type.name.toUpperCase()).join('/');
    const stats = pokemon.stats.map(stat => `${stat.stat.name.toUpperCase()}: ${stat.base_stat}`).join('/');
    return `${types} Pokemon\n${stats}`;
}