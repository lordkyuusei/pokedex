import type { EntityRef } from "./Pokemon";

export type LocationArea = {
    id: number;
    name: string;
    game_index: number;
    encounter_method_rates: EncounterMethodRef[];
    location: EntityRef;
    names: NameRef;
    pokemon_encounters: PokemonEncounterRef[];
}

type NameRef = {
    name: string;
    language: EntityRef;
};

type EncounterMethodRef = {
    encounter_method: EntityRef;
    version_details: VersionDetailRef[];
}

type VersionDetailRef = {
    rate: number;
    version: EntityRef;
}

type PokemonEncounterRef = {
    pokemon: EntityRef;
    version_details: VersionEncounterDetailRef[];
}

type VersionEncounterDetailRef = {
    version: EntityRef;
    max_chance: number;
    encounter_details: EncounterDetailRef[];
}

type EncounterDetailRef = {
    min_level: number;
    max_level: number;
    condition_values: EntityRef[];
    chance: number;
    method: EntityRef;
}