export const DEFAULT_MAP_COORDINATES = [72, 72, 52, 72, 52, 88, 72, 88];

export const MAPS_CONFIG: MapConfiguration = {
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
    }
}

export type MapOptions = {
    blinkEnabled: boolean,
    forceMeasure: 'width' | 'height',
}

export const DEFAULT_MAP_OPTIONS: MapOptions = {
    blinkEnabled: true,
    forceMeasure: 'height',
}

type MapConfiguration = {
    [key: string]: {
        viewBoxX: number,
        viewBoxY: number,
        step: number,
    }
}
