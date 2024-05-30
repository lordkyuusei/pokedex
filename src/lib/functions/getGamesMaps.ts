export const getGamesMaps = () => {
    const mapsPaths = import.meta.glob("/static/maps/*.png");

    const maps = Object.keys(mapsPaths).map(map => map.replace("/static/maps/", "").replace(".png", ""));
    return maps;
}