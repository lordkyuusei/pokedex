import type { Generation } from "$lib/types/generation";
import type { EntityRef } from "$lib/types/pokeapi/pokemon";
import type { PokemonSpecie } from "$lib/types/pokeapi/specie";

export default (generations: Generation[], pokemon: PokemonSpecie | null): Generation[] => {
    return pokemon?.generation ? generations.filter((g) => {
        const id = Number(pokemon.generation.url.split('/').at(-2));
        return g.id >= id;
    }) : generations;
}