import { TYPES, type PokemonType } from '$lib/types/pokemonTypes';

const POKEMON_TYPES: PokemonType[] = [
    {
        id: TYPES.INCONNU,
        name: 'unknown',
        code: "???",
        i18n: { fr: "Inconnu", en: "Unknown" },
        color: [],
        weaknesses: [],
        immunities: [],
        strengths: [],
        resistances: []
    },
    {
        id: TYPES.ACIER,
        name: 'steel',
        code: "WKDKJ8",
        i18n: { fr: "Acier", en: "Steel" },
        color: [196, 39, 55],
        weaknesses: [
            TYPES.COMBAT,
            TYPES.FEU,
            TYPES.SOL
        ],
        strengths: [
            TYPES.FÉE,
            TYPES.GLACE,
            TYPES.ROCHE
        ],
        immunities: [
            TYPES.POISON
        ],
        resistances: [
            TYPES.ACIER,
            TYPES.DRAGON,
            TYPES.FÉE,
            TYPES.GLACE,
            TYPES.INSECTE,
            TYPES.NORMAL,
            TYPES.PLANTE,
            TYPES.PSY,
            TYPES.ROCHE,
            TYPES.VOL
        ]
    },
    {
        id: TYPES.COMBAT,
        name: 'fighting',
        code: "LE3B9Q",
        i18n: { fr: "Combat", en: "Fighting" },
        color: [30, 100, 50],
        weaknesses: [
            TYPES.FÉE,
            TYPES.PSY,
            TYPES.VOL
        ],
        strengths: [
            TYPES.ACIER,
            TYPES.GLACE,
            TYPES.NORMAL,
            TYPES.ROCHE,
            TYPES.TÉNĖBRES
        ],
        immunities: [],
        resistances: [
            TYPES.INSECTE,
            TYPES.ROCHE,
            TYPES.TÉNĖBRES
        ]
    },
    {
        id: TYPES.DRAGON,
        name: 'dragon',
        code: "X9CDJA",
        i18n: { fr: "Dragon", en: "Dragon" },
        color: [233, 72, 60],
        weaknesses: [
            TYPES.DRAGON,
            TYPES.FÉE,
            TYPES.GLACE
        ],
        strengths: [
            TYPES.DRAGON
        ],
        immunities: [],
        resistances: [
            TYPES.EAU,
            TYPES.ÉLECTRIK,
            TYPES.FEU,
            TYPES.PLANTE
        ]
    },
    {
        id: TYPES.EAU,
        name: 'water',
        code: "BC3S",
        i18n: { fr: "Eau", en: "Water" },
        color: [213, 87, 54],
        weaknesses: [
            TYPES.ÉLECTRIK,
            TYPES.PLANTE
        ],
        strengths: [
            TYPES.FEU,
            TYPES.ROCHE,
            TYPES.SOL
        ],
        immunities: [],
        resistances: [
            TYPES.ACIER,
            TYPES.EAU,
            TYPES.FEU,
            TYPES.GLACE
        ]
    },
    {
        id: TYPES.ÉLECTRIK,
        name: 'electric',
        code: "JEMXL",
        i18n: { fr: "Électrik", en: "Electric" },
        color: [46, 100, 49],
        weaknesses: [
            TYPES.SOL
        ],
        strengths: [
            TYPES.EAU,
            TYPES.VOL
        ],
        immunities: [],
        resistances: [
            TYPES.ACIER,
            TYPES.ÉLECTRIK,
            TYPES.VOL
        ]
    },
    {
        id: TYPES.FÉE,
        name: 'fairy',
        code: "E8TQY",
        i18n: { fr: "Fée", en: "Fairy" },
        color: [300, 81, 69],
        weaknesses: [
            TYPES.ACIER,
            TYPES.POISON
        ],
        strengths: [
            TYPES.COMBAT,
            TYPES.DRAGON,
            TYPES.TÉNĖBRES
        ],
        immunities: [
            TYPES.DRAGON
        ],
        resistances: [
            TYPES.COMBAT,
            TYPES.INSECTE,
            TYPES.TÉNĖBRES
        ]
    },
    {
        id: TYPES.FEU,
        name: 'fire',
        code: "TQ7Q",
        i18n: { fr: "Feu", en: "Fire" },
        color: [360, 80, 52],
        weaknesses: [
            TYPES.EAU,
            TYPES.ROCHE,
            TYPES.SOL
        ],
        strengths: [
            TYPES.ACIER,
            TYPES.GLACE,
            TYPES.INSECTE,
            TYPES.PLANTE
        ],
        immunities: [],
        resistances: [
            TYPES.ACIER,
            TYPES.FÉE,
            TYPES.FEU,
            TYPES.GLACE,
            TYPES.INSECTE,
            TYPES.PLANTE
        ]
    },
    {
        id: TYPES.GLACE,
        name: 'ice',
        code: "BDSK",
        i18n: { fr: "Glace", en: "Ice" },
        color: [192, 100, 62],
        weaknesses: [
            TYPES.ACIER,
            TYPES.COMBAT,
            TYPES.FEU,
            TYPES.ROCHE
        ],
        strengths: [
            TYPES.DRAGON,
            TYPES.PLANTE,
            TYPES.SOL,
            TYPES.VOL
        ],
        immunities: [],
        resistances: [
            TYPES.GLACE
        ]
    },
    {
        id: TYPES.INSECTE,
        name: 'bug',
        code: "WV39T",
        i18n: { fr: "Insecte", en: "Bug" },
        color: [67, 80, 35],
        weaknesses: [
            TYPES.FEU,
            TYPES.ROCHE,
            TYPES.VOL
        ],
        strengths: [
            TYPES.PLANTE,
            TYPES.PSY,
            TYPES.TÉNĖBRES
        ],
        immunities: [],
        resistances: [
            TYPES.COMBAT,
            TYPES.PLANTE,
            TYPES.SOL
        ]
    },
    {
        id: TYPES.NORMAL,
        name: 'normal',
        code: "MJYMVL",
        i18n: { fr: "Normal", en: "Normal" },
        color: [120, 1, 63],
        weaknesses: [
            TYPES.COMBAT
        ],
        strengths: [],
        immunities: [
            TYPES.SPECTRE
        ],
        resistances: []
    },
    {
        id: TYPES.PLANTE,
        name: 'grass',
        code: "7W3Z",
        i18n: { fr: "Plante", en: "Grass" },
        color: [108, 64, 39],
        weaknesses: [
            TYPES.FEU,
            TYPES.GLACE,
            TYPES.INSECTE,
            TYPES.POISON,
            TYPES.VOL
        ],
        strengths: [
            TYPES.EAU,
            TYPES.ROCHE,
            TYPES.SOL
        ],
        immunities: [],
        resistances: [
            TYPES.EAU,
            TYPES.ÉLECTRIK,
            TYPES.PLANTE,
            TYPES.SOL
        ]
    },
    {
        id: TYPES.POISON,
        name: 'poison',
        code: "4+8V",
        i18n: { fr: "Poison", en: "Poison" },
        color: [275, 58, 52],
        weaknesses: [
            TYPES.PSY,
            TYPES.SOL
        ],
        strengths: [
            TYPES.FÉE,
            TYPES.PLANTE
        ],
        immunities: [],
        resistances: [
            TYPES.COMBAT,
            TYPES.FÉE,
            TYPES.INSECTE,
            TYPES.PLANTE,
            TYPES.POISON
        ]
    },
    {
        id: TYPES.PSY,
        name: 'psychic',
        code: "TEQSJ",
        i18n: { fr: "Psy", en: "Psychic" },
        color: [340, 85, 59],
        weaknesses: [
            TYPES.INSECTE,
            TYPES.SPECTRE,
            TYPES.TÉNĖBRES
        ],
        strengths: [
            TYPES.COMBAT,
            TYPES.POISON
        ],
        immunities: [],
        resistances: [
            TYPES.COMBAT,
            TYPES.PSY
        ]
    },
    {
        id: TYPES.ROCHE,
        name: 'rock',
        code: "YXK",
        i18n: { fr: "Roche", en: "Rock" },
        color: [53, 23, 60],
        weaknesses: [
            TYPES.ACIER,
            TYPES.COMBAT,
            TYPES.EAU,
            TYPES.PLANTE,
            TYPES.SOL
        ],
        strengths: [
            TYPES.FEU,
            TYPES.GLACE,
            TYPES.INSECTE,
            TYPES.VOL
        ],
        immunities: [],
        resistances: [
            TYPES.FEU,
            TYPES.NORMAL,
            TYPES.POISON,
            TYPES.VOL
        ]
    },
    {
        id: TYPES.SOL,
        name: 'ground',
        code: "9LWB+",
        i18n: { fr: "Sol", en: "Ground" },
        color: [27, 69, 34],
        weaknesses: [
            TYPES.EAU,
            TYPES.GLACE,
            TYPES.PLANTE
        ],
        strengths: [
            TYPES.ACIER,
            TYPES.ÉLECTRIK,
            TYPES.FEU,
            TYPES.POISON,
            TYPES.ROCHE
        ],
        immunities: [
            TYPES.ÉLECTRIK
        ],
        resistances: [
            TYPES.POISON,
            TYPES.ROCHE
        ]
    },
    {
        id: TYPES.SPECTRE,
        name: 'ghost',
        code: "QWEY",
        i18n: { fr: "Spectre", en: "Ghost" },
        color: [300, 28, 35],
        weaknesses: [
            TYPES.SPECTRE,
            TYPES.TÉNĖBRES
        ],
        strengths: [
            TYPES.PSY,
            TYPES.SPECTRE
        ],
        immunities: [
            TYPES.COMBAT,
            TYPES.NORMAL
        ],
        resistances: [
            TYPES.INSECTE,
            TYPES.TÉNĖBRES
        ]
    },
    {
        id: TYPES.TÉNĖBRES,
        name: 'dark',
        code: "473",
        i18n: { fr: "Ténèbres", en: "Dark" },
        color: [7, 13, 27],
        weaknesses: [
            TYPES.COMBAT,
            TYPES.FÉE,
            TYPES.INSECTE
        ],
        strengths: [
            TYPES.PSY,
            TYPES.SPECTRE
        ],
        immunities: [
            TYPES.PSY
        ],
        resistances: [
            TYPES.TÉNĖBRES,
            TYPES.SPECTRE
        ]
    },
    {
        id: TYPES.VOL,
        name: 'flying',
        code: "MLRJC",
        i18n: { fr: "Vol", en: "Flying" },
        color: [209, 79, 73],
        weaknesses: [
            TYPES.ÉLECTRIK,
            TYPES.GLACE,
            TYPES.ROCHE
        ],
        strengths: [
            TYPES.COMBAT,
            TYPES.INSECTE,
            TYPES.PLANTE
        ],
        immunities: [
            TYPES.SOL
        ],
        resistances: [
            TYPES.COMBAT,
            TYPES.PLANTE,
            TYPES.INSECTE
        ]
    },
    {
        id: TYPES.OBSCUR,
        name: 'shadow',
        code: "J473",
        i18n: { fr: "Obscur", en: "Shadow" },
        color: [0, 0, 50],
        weaknesses: [],
        strengths: [
            TYPES.OBSCUR
        ],
        immunities: [],
        resistances: [
            TYPES.OBSCUR
        ],
    }
];

export default POKEMON_TYPES;