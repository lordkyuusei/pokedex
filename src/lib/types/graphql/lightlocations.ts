import type { LightTranslation } from "./common";

export type LightLocationsResults = {
    data: LightLocationsData;
}

type LightLocationsData = {
    pokemon_v2_versiongroup: LightLocationVersionGroup[];
}

type LightLocationVersionGroup = {
    generation_id: number,
    name: string,
    pokemon_v2_versiongroupregions: LightLocationVersionGroupRegion[]
}

type LightLocationVersionGroupRegion = {
    id: number;
    pokemon_v2_region: LightLocationVersionRegion;
}

type LightLocationVersionRegion = {
    name: string;
    pokemon_v2_locations: LightLocationNode[];
}

type LightLocationNode = {
    name: string;
    pokemon_v2_locationareas: LightLocationAreaNode[];
}

type LightLocationAreaNode = {
    id: number;
    name: string;
    pokemon_v2_locationareanames: LightTranslation[]
}