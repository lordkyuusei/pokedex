import type { EntityRef } from "./Pokemon"

export type PokemonLocationArea = {
    location_area: EntityRef;
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