import type { PastTypesRef, TypeRef } from "$lib/types/pokeapi/pokemon";

export const fetchOldTypes = (past_types: PastTypesRef[], types: TypeRef[], gen: number) => {
    const relevantTypes = past_types
        .filter((t) => gen <= Number(t.generation.url.at(-2)))
        .flatMap((t) => t.types.map((t) => t.type.name));

    return relevantTypes.length ? relevantTypes : fetchNewTypes(types);
};

export const fetchNewTypes = (types: TypeRef[]) => types.map((t) => t.type.name);
