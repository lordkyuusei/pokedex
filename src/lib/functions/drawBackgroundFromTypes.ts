import TYPES from '$lib/constants/pokemon_types';

export const drawDiscCover = (type: string): string => {
    const [h, s, l] = TYPES.find(t => t.name === type)?.color || [];

    const hsl = `hsl(${h}, ${s}%, ${l}%)`;
    return `radial-gradient(circle, white 5%, ${hsl})`;
}

export const drawMoveCover = (type: string): string => {
    const [h, s, l] = TYPES.find(t => t.name === type)?.color || [];

    const [fHsl, sHsl] = [`hsl(${h}, ${s}%, ${l}%)`, `hsl(${h}, ${s}%, ${l - 20}%)`];
    return `linear-gradient(90deg, ${fHsl}, ${sHsl})`;
}

const drawBookBackground = (types: string[] = [], portrait: boolean = false): string => {
    if (types.length) {
        const [fHsl, sHsl] = types.map(
            (type) => TYPES.find((t) => t.name === type)?.color || []
        );

        const angle = portrait ? '180deg' : '135deg';

        return sHsl
            ? `linear-gradient(${angle}, hsla(${fHsl[0]}, ${fHsl[1]}%, ${fHsl[2]}%, 0.50) 25%, hsla(${sHsl[0]}, ${sHsl[1]}%, ${sHsl[2]}%, 0.50) 75%)`
            : `radial-gradient(circle, hsla(${fHsl[0]}, ${fHsl[1]}%, ${fHsl[2]}%, 0.50) 25%, hsla(${fHsl[0]}, ${fHsl[1]}%, 35%, 0.50) 75%)`;
    }
    return "";
};

export const drawBoxShadow = (type: string): string => {
    const hsl: number[] = TYPES.find((t => t.name === type))?.color || [0, 0, 0];

    return `3px 3px 6px hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2] - 15}%), -3px -3px 6px hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2] + 15}%)`
}

export const getPkmnTypeTranslation = (type: string) => TYPES.find(t => t.name === type)?.code;
export const getPkmnTypeColor = (type: string) => {
    const [h, s, l] = TYPES.find(t => t.name === type)?.color || [];
    return `hsl(${h}, ${s}%, ${l}%)`;
}

export const getPkmnTypeLang = (type: string, lang: 'fr' | 'en') => TYPES.find(t => t.name === type)?.i18n[lang];

export default drawBookBackground;