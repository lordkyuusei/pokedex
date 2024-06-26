export const DEFAULT_MAP_COORDINATES = [72, 72, 52, 72, 52, 88, 72, 88];

export const DEFAULT_MAP_CONFIG: MapConfiguration = {
    "viewBoxX": 160,
    "viewBoxY": 136,
    "step": 2,
}

const MAPS_CONFIG: MapConfigurationList = {
    "red-blue-yellow-green": {
        "viewBoxX": 160,
        "viewBoxY": 136,
        "step": 2,
    },
    "gold-silver-crystal": {
        "viewBoxX": 296,
        "viewBoxY": 112,
        "step": 2
    },
    "ruby-sapphire": {
        "viewBoxX": 240,
        "viewBoxY": 160,
        "step": 2
    },
    "emerald": {
        "viewBoxX": 240,
        "viewBoxY": 160,
        "step": 2
    },
    "firered-leafgreen": {
        "viewBoxX": 160,
        "viewBoxY": 136,
        "step": 1
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
    }
}

export const getMapName = (map: string) => map.split('_')[1] ?? 'base';
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
}
