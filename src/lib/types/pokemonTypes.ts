export enum TYPES {
    INCONNU = 0,
    ACIER = 1,
    COMBAT = 2,
    DRAGON = 3,
    EAU = 4,
    ÉLECTRIK = 5,
    FEU = 6,
    FÉE = 7,
    GLACE = 8,
    INSECTE = 9,
    NORMAL = 10,
    PLANTE = 11,
    POISON = 12,
    PSY = 13,
    ROCHE = 14,
    SOL = 15,
    SPECTRE = 16,
    TÉNĖBRES = 17,
    VOL = 18,
    OBSCUR = 19
}

export type PokemonType = {
    id: number;
    name: string;
    code: string;
    i18n: { fr: string, en: string };
    color: number[];
    weaknesses: TYPES[];
    strengths: TYPES[];
    immunities: TYPES[];
    resistances: TYPES[];
};