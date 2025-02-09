import type { Pokemon } from "$lib/types/pokeapi/pokemon";
import type { PokemonSpecie } from "$lib/types/pokeapi/specie";

const mapKeyToStat: { [x: string]: string } = {
    hp: 'Hp',
    attack: 'Atk',
    defense: 'Def',
    'special-attack': 'Sp.Atk',
    'special-defense': 'Sp.Def',
    speed: 'Spe'
};

export const computeOpenGraphDescription = (pokemon: Pokemon | null, specie: PokemonSpecie | null) => {
    if (!pokemon && !specie) return '';

    const types = pokemon.types.map(type => type.type.name.toUpperCase()).join('/');
    const stats = pokemon.stats.map(stat => `${mapKeyToStat[stat.stat.name]}: ${stat.base_stat}`).join('/');
    return `${types} Gen ${specie.generation.name} Pokemon\n${stats}`;
}