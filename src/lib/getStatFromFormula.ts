export const HPFormula = (
	base_stat: number,
	level: number = 100,
	ev: number = 252,
	iv: number = 31
) => CommonStatFormula(base_stat, level, ev, iv) + level + 10;

export const StatFormula = (
	base_stat: number,
	level: number = 100,
	ev: number = 252,
	iv: number = 31,
	nature: number = 1.1
) => Math.floor(CommonStatFormula(base_stat, level, ev, iv) + 5 * nature);

const CommonStatFormula = (base_stat: number, level: number, ev: number, iv: number) =>
	Math.floor(0.01 * (2 * base_stat + iv + Math.floor(ev / 4)) * level);
