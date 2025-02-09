export const MAX_STATS_POINTS_PER_STAT = 65535;
export const MAX_EV_PER_STAT = 255;
export const MAX_STAT = 255;
export const MAX_DV_PER_STAT = 15;
export const MAX_IV_PER_STAT = 31;

export const mapKeyToStat: { [x: string]: { order: number; name: string } } = {
    hp: { order: 0, name: 'H.P.' },
    attack: { order: 1, name: 'Attaque' },
    'special-attack': { order: 2, name: 'Attaque Spé.' },
    speed: { order: 3, name: 'Vitesse' },
    'special-defense': { order: 4, name: 'Défense Spé.' },
    defense: { order: 5, name: 'Défense' }
};

/** SPECIAL = ATK.SPE + DEF.SPE in gen 1 */
export const MAX_CUMULATIVE_STATS_POINTS_GEN1 = MAX_STATS_POINTS_PER_STAT * 5;
export const MAX_CUMULATIVE_STATS_POINTS_GEN2 = MAX_STATS_POINTS_PER_STAT * 6;
export const MAX_CUMULATIVE_EVS = MAX_EV_PER_STAT * 2;

/** Polugon graph */

export const POLYGON_MAX_COORDINATES = [
    [126, 0],
    [236, 65],
    [236, 187],
    [126, 252],
    [16, 187],
    [16, 65]
];


export const OLD_POLYGON_MAX_COORDINATES = [
    [32768, 0],
    [61486, 16867],
    [61486, 48392],
    [32768, 65535],
    [4049, 48392],
    [4049, 16867]
];

export const mapPolygonCoordinatesToString = (coords: number[][]) => coords.reduce((acc, couple) => `${acc} ${couple[0]},${couple[1]}`, "");

