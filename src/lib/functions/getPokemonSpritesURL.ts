import { SPRITE_URL } from "$lib/constants/api.json";

/**
 * 
 * @param id The Pokemon National DexID
 * @param version The version of the game, lowercase, with dashes between words, or 'icons'. Ex: emerald
 * @param generation The generation of the game, lowercase, with roman numerals. Ex: generation-iii
 * @param orientation The orientation (???)
 * @returns 
 */
export const fetchPokemonSpriteURL = (
    id: number | string,
    version?: string,
    generation?: string,
    orientation?: string
): string => {
    const specific = version && generation ? `/versions/${generation}/${version}` : '';
    return `${SPRITE_URL}${specific}${orientation || ''}/${id}.png`;
};

export const fetchPokemonShinySpriteURL = (
    id: number | string,
    version?: string,
    generation?: string,
    orientation?: string
): string => {
    const specific = version && generation ? `/versions/${generation}/${version}` : '';
    return `${SPRITE_URL}${specific}${orientation || ''}/shiny/${id}.png`;
};