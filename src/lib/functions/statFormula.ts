export const HPFormula = (
    base_stat: number,
    level: number = 100,
    ev: number = 252,
    iv: number = 31,
    isOldGen: boolean = false
) => isOldGen ? LegacyStatFormula(base_stat, level, ev, iv) + level + 10 : CommonStatFormula(base_stat, level, ev, iv) + level + 10;

export const StatFormula = (
    base_stat: number,
    level: number = 100,
    ev: number = 252,
    iv: number = 31,
    nature: number = 1.0,
    isOldGen: boolean = false
) => isOldGen ? LegacyStatFormula(base_stat, level, ev, iv) + 5 : Math.floor((CommonStatFormula(base_stat, level, ev, iv) + 5) * nature);

const LegacyStatFormula = (base_stat: number, level: number, ev: number, iv: number) =>
    Math.floor(0.01 * ((base_stat + iv) * 2 + (Math.sqrt(ev) / 4)) * level);

const CommonStatFormula = (base_stat: number, level: number, ev: number, iv: number) =>
    Math.floor(0.01 * (2 * base_stat + iv + Math.floor(ev / 4)) * level);