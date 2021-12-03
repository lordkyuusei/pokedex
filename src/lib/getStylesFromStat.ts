import type StatTreshold from "../store/types/PokemonStat";

const MAX_STAT_VALUE = 255;

const tresholds: StatTreshold[] = [
    { p: 0.0, color: { r: 0xff, g: 0, b: 0 } },
    { p: 0.3, color: { r: 0xdd, g: 0xdd, b: 0 } },
    { p: 0.6, color: { r: 0, g: 0xdd, b: 0xdd } },
    { p: 1.0, color: { r: 0, g: 0xff, b: 0xff } },
];

export const getStatColor = (base_stat: number, shade: number = 1): string => {
    const p = base_stat / MAX_STAT_VALUE;
    const index = tresholds.filter(t => p > t.p).length;
    const [lower, upper] = [tresholds[index - 1], tresholds[index]];
    const range = upper.p - lower.p;
    const rangeP = (p - lower.p) / range;
    const pLower = 1 - rangeP;
    const color = {
        r: Math.floor(lower.color.r * pLower + upper.color.r * rangeP),
        g: Math.floor(lower.color.g * pLower + upper.color.g * rangeP),
        b: Math.floor(lower.color.b * pLower + upper.color.b * rangeP),
    }
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${shade})`;
};

export const getStatHeight = (base_stat: number): string => `${Math.floor((base_stat / 255) * 100)}%`;