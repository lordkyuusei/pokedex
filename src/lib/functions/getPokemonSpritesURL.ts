import { SPRITE_URL } from "$lib/constants/api.json";

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