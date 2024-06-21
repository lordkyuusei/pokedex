type PokemonMap = {
    name: string,
    submaps: string[]
};

export const findMatchingMaps = (version: string) => {
    const maps = getGamesMaps();

    const map = maps.find(map => map.name.includes(version));
    if (!map) return [];

    return map.submaps;
}

const getGamesMaps = (): PokemonMap[] => {
    const mapsPaths = import.meta.glob("/static/maps/*.png");

    const maps = Object.keys(mapsPaths).reduce((acc, map) => {
        const mapName: string = map.replace("/static/maps/", "").replace(".png", "");

        const [mapId, _] = mapName.split('_');
        const mapIndex: number = acc.findIndex(map => map.name === mapId);

        if (mapIndex > -1) {
            acc[mapIndex].submaps = [...acc[mapIndex].submaps, mapName];
            return acc;
        } else {
            return [...acc, { name: mapName, submaps: [mapName] }];
        }
    }, [] as PokemonMap[]);

    return maps;
}