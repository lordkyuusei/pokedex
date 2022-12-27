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
	VOL = 18
}

export type PokemonType = {
	id: number;
	name: string;
	color?: string;
	icon?: string;
	weaknesses?: TYPES[];
	strengths?: TYPES[];
	immunities?: TYPES[];
	resistances?: TYPES[];
};
