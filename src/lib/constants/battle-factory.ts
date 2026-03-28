import { fetchFullTypes } from "$lib/functions/computeTypesRelationship";
import type { FactoryPokemon } from "$lib/types/battle-factory";
import type { LightMoveDetails } from "$lib/types/lightmove";

export const openLevelPokemonStart: number = 373;

// player, 7th trainer, Noland's (if applicable)
export const roundToIVsSpreadMap = [
    { round: 1, ivs: [ 3,  6,  0] },
    { round: 2, ivs: [ 6,  9,  0] },
    { round: 3, ivs: [ 9, 12, 15] },
    { round: 4, ivs: [12, 15,  0] },
    { round: 5, ivs: [15, 18,  0] },
    { round: 6, ivs: [21, 31, 31] },
    { round: 7, ivs: [31, 31,  0] }
];

export const swapsToUpperRoundPokemonThresholdsMap = [
    { range: [0,   15], amount: 0 },
    { range: [15,  21], amount: 1 },
    { range: [22,  28], amount: 2 },
    { range: [29,  35], amount: 3 },
    { range: [36,  42], amount: 4 },
    { range: [43, Infinity], amount: 5 }
];

export const typeToItemBoostsMap = [
    { type: "water", item: "Mystic Water"},
    { type: "fire", item: "Charcoal"},
    { type: "electrik", item: "Magnet"},
    { type: "poison", item: "Poison Barb"},
    { type: "grass", item: "Miracle Seed"},
    { type: "psychic", item: "TwistedSpoon"},
    { type: "ground", item: "Soft Sand"},
    { type: "ice", item: "NeverMeltIce"},
    { type: "flying", item: "Sharp Beak"}
]

export const battleStyleMoves = [
    {
        "sentence": "battle-factory.style.0",
        "moves": []
    },
    {
        "sentence": "battle-factory.style.1",
        "moves": [
            "acid-armor",
            "agility",
            "amnesia",
            "barrier",
            "belly-drum",
            "bulk-up",
            "calm-mind",
            "charge",
            "conversion",
            "conversion-2",
            "cosmic-power",
            "defense-curl",
            "double-team",
            "dragon-dance",
            "focus-energy",
            "growth",
            "harden",
            "howl",
            "iron-defense",
            "meditate",
            "minimize",
            "psych-up",
            "sharpen",
            "snatch",
            "swords-dance",
            "tail-glow",
            "withdraw"
        ]
    },
    {
        "sentence": "battle-factory.style.2",
        "moves": [
            "attract",
            "block",
            "confuse-ray",
            "disable",
            "encore",
            "flatter",
            "glare",
            "grass-whistle",
            "hypnosis",
            "imprison",
            "leech-seed",
            "lovely-kiss",
            "mean-look",
            "poison-gas",
            "poison-powder",
            "sing",
            "sleep-powder",
            "snatch",
            "spider-web",
            "spikes",
            "spore",
            "stun-spore",
            "supersonic",
            "swagger",
            "sweet-kiss",
            "taunt",
            "teeter-dance",
            "thunder-wave",
            "torment",
            "toxic",
            "yawn",
            "will-o-wisp"
        ]
    },
    {
        "sentence": "battle-factory.style.3",
        "moves": [
            "aromatherapy",
            "baton-pass",
            "detect",
            "endure",
            "haze",
            "heal-bell",
            "ingrain",
            "light-screen",
            "magic-coat",
            "milk-drink",
            "mist",
            "moonlight",
            "morning-sun",
            "mud-sport",
            "protect",
            "recover",
            "reflect",
            "rest",
            "safeguard",
            "slack-off",
            "soft-boiled",
            "swallow",
            "synthesis",
            "recycle",
            "refresh",
            "water-sport",
            "wish"
        ]
    },
    {
        "sentence": "battle-factory.style.4",
        "moves": [
            "bide",
            "blast-burn",
            "counter",
            "destiny-bond",
            "double-edge",
            "explosion",
            "facade",
            "fissure",
            "flail",
            "focus-punch",
            "frenzy-plant",
            "grudge",
            "guillotine",
            "horn-drill",
            "hydro-cannon",
            "hyper-beam",
            "memento",
            "mirror-coat",
            "overheat",
            "pain-split",
            "perish-song",
            "psycho-boost",
            "reversal",
            "self-destruct",
            "sky-attack",
            "volt-tackle"
        ]
    },
    {
        "sentence": "battle-factory.style.5",
        "moves": [
            "charm",
            "cotton-spore",
            "fake-tears",
            "feather-dance",
            "flash",
            "growl",
            "kinesis",
            "knock-off",
            "leer",
            "metal-sound",
            "sand-attack",
            "scary-face",
            "screech",
            "smokescreen",
            "spite",
            "string-shot",
            "sweet-scent",
            "tail-whip",
            "tickle"
        ]
    },
    {
        "sentence": "battle-factory.style.6",
        "moves": [
            "assist",
            "camouflage",
            "curse",
            "follow-me",
            "metronome",
            "mimic",
            "mirror-move",
            "present",
            "role-play",
            "sketch",
            "skill-swap",
            "substitute",
            "transform",
            "trick"
        ]
    },
    {
        "sentence": "battle-factory.style.7",
        "moves": [
            "hail",
            "rain-dance",
            "sandstorm",
            "sunny-day",
            "weather-ball"
        ]
    }
];

export const calcGenIIIDamageFormula = (user: FactoryPokemon, target: FactoryPokemon, move: LightMoveDetails, offensiveStat: number, defensiveStat: number, level: number) => {
    const moveType = fetchFullTypes([move.moveType])[0];
    const targetTypes = fetchFullTypes(target.types);

    if (move.power === 0) return Array.from({ length: 16 }).map(_ => 0);

    const baseDamage = (((2 * level) / 5) + 2) * move.power * (offensiveStat / defensiveStat) / 50;

    const burn = 1;
    const screen = 1;
    const targets = 1;
    const weather = 1;
    const flashFire = 1;
    const damageEquation = (baseDamage * ((burn * screen * targets * weather * flashFire))) + 2;

    const itemBoost = typeToItemBoostsMap.find(t => t.type === moveType.name)?.item === user.item ? 1.1 : 1;
    const stockpile = 1;
    const critical = 1;
    const doubledmg = 1;
    const charge = 1;
    const helpingHand = 1;
    const stab = user.types.includes(move.moveType) ? 1.5 : 1;

    const effectiveModifier1 =
        targetTypes[0].immunities.includes(moveType.id) ? 0 :
            targetTypes[0].resistances.includes(moveType.id) ? 0.5 :
                targetTypes[0].weaknesses.includes(moveType.id) ? 2 : 1

    const effectiveModifier2 = !targetTypes[1] ? 1 :
        targetTypes[1].immunities.includes(moveType.id) ? 0 :
            targetTypes[1].resistances.includes(moveType.id) ? 0.5 :
                targetTypes[1].weaknesses.includes(moveType.id) ? 2 : 1


    const damageWithModifiers = damageEquation * itemBoost * stockpile * critical * doubledmg * charge * helpingHand * stab * effectiveModifier1 * effectiveModifier2;

    return Array.from({ length: 16 }).map((_, index) => Math.floor(damageWithModifiers * (0.85 + (index / 100))));
}