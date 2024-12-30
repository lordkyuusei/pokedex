import type { PastTypesRef, Pokemon, TypeRef } from "$lib/types/pokeapi/pokemon";

const fetchOldTypes = (past_types: PastTypesRef[], types: TypeRef[], gen: number) => {
    const relevantTypes = past_types
        .filter((t) => gen <= Number(t.generation.url.at(-2)))
        .flatMap((t) => t.types.map((t) => t.type.name));

    return relevantTypes.length ? relevantTypes : fetchNewTypes(types);
};

const fetchNewTypes = (types: TypeRef[]) => types.map((t) => t.type.name);

export const computePokemonTypes = (pokemon: Pokemon, id: number) => pokemon.past_types.length ?
    fetchOldTypes(pokemon.past_types, pokemon.types, id) :
    fetchNewTypes(pokemon.types);
