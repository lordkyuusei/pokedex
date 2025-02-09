import type { LocationWithCoords } from "$lib/types/location";
import { MAP_BASE_NAME } from "./locations";

export const DEFAULT_MAP_CONFIG: MapConfiguration = {
    "viewBoxX": 160,
    "viewBoxY": 136,
    "step": 2,
    "size": 8,
}

export const getDefaultCoordinatesForClient = (config: MapConfiguration): LocationWithCoords[] => [{
    name: MAP_BASE_NAME,
    mapName: 'base',
    i18nName: { fr: 'base', en: 'base' },
    coords: getDefaultCoordinates(config),
    conditions: []
}]

export const getDefaultCoordinates = (config: MapConfiguration) => {
    const { viewBoxX, viewBoxY, size } = config;
    const xCenter = Math.floor(viewBoxX / 2);
    const yCenter = Math.floor(viewBoxY / 2);

    const gap = Math.floor(size / 2);
    const start = [xCenter - gap, yCenter - gap];
    return [...start, start[0] + size, start[1], start[0] + size, start[1] + size, start[0], start[1] + size];
}

const MAPS_CONFIG: MapConfigurationList = {
    "red-blue-yellow-green": {
        "viewBoxX": 160,
        "viewBoxY": 136,
        "step": 2,
        "size": 8,
    },
    "gold-silver": {
        "viewBoxX": 296,
        "viewBoxY": 112,
        "step": 2,
        "size": 8,
    },
    "crystal": {
        "viewBoxX": 296,
        "viewBoxY": 112,
        "step": 2,
        "size": 8,
    },
    "ruby-sapphire": {
        "viewBoxX": 240,
        "viewBoxY": 160,
        "step": 2,
        "size": 8,
    },
    "emerald": {
        "viewBoxX": 240,
        "viewBoxY": 160,
        "step": 2,
        "size": 8,
    },
    "firered-leafgreen": {
        "viewBoxX": 160,
        "viewBoxY": 136,
        "step": 1,
        "size": 6,
    },
    "firered-leafgreen_sevii-I": {
        "viewBoxX": 160,
        "viewBoxY": 136,
        "step": 1,
    },
    "firered-leafgreen_sevii-II": {
        "viewBoxX": 160,
        "viewBoxY": 136,
        "step": 1
    },
    "firered-leafgreen_sevii-III": {
        "viewBoxX": 160,
        "viewBoxY": 136,
        "step": 1
    },
    "diamond-pearl": {
        "viewBoxX": 215,
        "viewBoxY": 167,
        "step": 1,
        "size": 6
    }
}

export const getMapName = (map: string) => map.split('_')[1] ?? MAP_BASE_NAME;
export const getMapConfig = (map: string) => MAPS_CONFIG[map] ?? DEFAULT_MAP_CONFIG;

export type MapOptions = {
    blinkEnabled: boolean,
    forceMeasure: 'width' | 'height',
}

export const DEFAULT_MAP_OPTIONS: MapOptions = {
    blinkEnabled: true,
    forceMeasure: 'height',
}

type MapConfigurationList = {
    [key: string]: MapConfiguration
}

export type MapConfiguration = {
    viewBoxX: number,
    viewBoxY: number,
    step: number,
    size: number,
}
