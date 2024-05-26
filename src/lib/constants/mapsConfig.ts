const MAPS_CONFIG: MapConfiguration = {
    "red-blue-yellow-green": {
        "viewBoxX": 160,
        "viewBoxY": 136,
        "step": 2,
    },

    "gold-silver-crystal": {
        "viewBoxX": 296,
        "viewBoxY": 112,
        "step": 2
    }
}

type MapConfiguration = {
    [key: string]: {
        viewBoxX: number,
        viewBoxY: number,
        step: number,
    }
}

export default MAPS_CONFIG;