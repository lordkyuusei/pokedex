export type LightMove = {
    id: number;
    generation: string;
    moves: LightMoveDetails[]
}

export type LightMoveDetails = {
    id: number;
    name: string;
    power: number;
    accuracy: number;
    pp: number;
    moveType: string;
    damageClass: string;
    i18n: { fr: string, en: string }
}