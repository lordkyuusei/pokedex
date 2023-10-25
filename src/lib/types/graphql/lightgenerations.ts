import type { LightTranslation } from "./common";

export type LightGenerationResults = {
    data: LightGenerationData;
}

type LightGenerationData = {
    pokemon_v2_generation: LightGeneration[]
}

type LightGeneration = {
    id: number,
    name: string,
    pokemon_v2_pokemonspecies_aggregate: LightSpeciesAggregate,
    pokemon_v2_generationnames: LightTranslation[],
    pokemon_v2_region: LightRegion,
    pokemon_v2_versiongroups: LightVersionGroups[],
}

type LightSpeciesAggregate = {
    aggregate: {
        min: { id: number },
        max: { id: number }
    }
}
type LightRegion = {
    name: string,
    pokemon_v2_regionnames: LightTranslation[],
}

type LightVersionGroups = {
    name: string;
    pokemon_v2_versions: LightVersion[];
    pokemon_v2_pokedexversiongroups: LightPokedexVersionGroup[];
}

type LightVersion = {
    name: string,
    pokemon_v2_versionnames: LightTranslation[]
}

type LightPokedexVersionGroup = {
    pokedex_id: number;
    pokemon_v2_pokedex: { name: string }
}