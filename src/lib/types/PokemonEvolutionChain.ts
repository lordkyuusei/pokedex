import type { EntityRef } from './Pokemon';

export type PokemonEvolution = {
	id: number;
	baby_trigger_item: EntityRef;
	chain: EvolutionChain;
};

export type EvolutionChain = {
	evolution_details: EvolutionDetail[];
	is_baby: boolean;
	species: EntityRef;
	evolves_to: EvolutionChain[];
};

export type EvolutionDetail = {
	gender?: number;
	held_item?: EntityRef;
	item?: EntityRef;
	known_move?: EntityRef;
	known_move_type?: EntityRef;
	location?: EntityRef;
	min_affection: number;
	min_beauty: number;
	min_happiness: number;
	min_level: number;
	needs_overworld_rain: boolean;
	party_species?: EntityRef;
	party_type: EntityRef;
	relative_physical_stats: number;
	time_of_day: string;
	trade_species?: EntityRef;
	trigger: EntityRef;
	turn_upside_down: boolean;
};

export type EvolutionUnit = {
	name: string;
	trigger?: EvolutionDetail[];
};
