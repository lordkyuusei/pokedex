import { TYPES, type PokemonType } from '$lib/types/PokemonType';

const POKEMON_TYPES: PokemonType[] = [
	{
		id: TYPES.INCONNU,
		name: 'unknown',
		color: 'rgb(255, 255, 255, 0.69)',
		icon: '❓',
		weaknesses: [],
		immunities: [],
		strengths: [],
		resistances: []
	},
	{
		id: TYPES.ACIER,
		name: 'steel',
		color: 'rgb(120, 145, 162, 0.69)',
		icon: '⚙️',
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
		color: 'rgb(205, 92, 59, 0.69)',
		icon: '💪',
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
		color: 'rgb(82, 136, 205, 0.69)',
		icon: '🐲',
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
		color: 'rgb(90, 139, 205, 0.69)',
		icon: '💧',
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
		color: 'rgb(255, 213, 65, 0.69)',
		icon: '⚡',
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
		color: 'rgb(246, 123, 148, 0.69)',
		icon: '🧚‍♀️',
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
		color: 'rgb(201, 56, 56, 0.69)',
		icon: '🔥',
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
		color: 'rgb(205, 230, 255, 0.69)',
		icon: '🧊',
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
		color: 'rgb(106, 139, 90, 0.69)',
		icon: '🐞',
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
		color: 'rgb(255, 165, 159, 0.69)',
		icon: '🐾',
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
		color: 'rgba(121, 187, 100, 0.69)',
		icon: '☘️',
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
		color: 'rgb(123, 98, 172, 0.69)',
		icon: '🏴‍☠️',
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
		color: 'rgb(210, 147, 196, 0.69)',
		icon: '👁️‍🗨️',
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
		color: 'rgb(108, 90, 42, 0.69)',
		icon: '🪨',
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
		color: 'rgb(201, 182, 141, 0.69)',
		icon: '🕳️',
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
		id: TYPES.TÉNĖBRES,
		name: 'dark',
		color: 'rgb(73, 73, 92, 0.69)',
		icon: '😈',
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
		color: 'rgb(176, 199, 241, 0.69)',
		icon: '🕊️',
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
];

export default POKEMON_TYPES;
