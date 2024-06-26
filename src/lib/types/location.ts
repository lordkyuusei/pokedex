import { Types } from 'mongoose'
import type { EncounterDetailRef } from './pokeapi/location-area'

export type Location = {
    _id: Types.ObjectId,
    name: string,
    generation: number,
    regions: Region[]
}

type Region = {
    _id: Types.ObjectId,
    name: string,
    locations: LocationNode[]
}

export type LocationNode = {
    _id: Types.ObjectId,
    id: string,
    mapName: string,
    areas: LocationArea[]
}

export type LocationArea = {
    _id: Types.ObjectId,
    id: number,
    name: string,
    coords: number[],
    i18nName: { fr: string, en: string }
}

export type LocationWithCoords = {
    name: string;
    i18nName: { fr: string, en: string }
    coords: number[];
    conditions: EncounterDetailRef[];
};

export type SimplifiedLocation = {
    version: string;
    locations: {
        location: string;
        chances: any;
        conditions: any;
    }[]
}
