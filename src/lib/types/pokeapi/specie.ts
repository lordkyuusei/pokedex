import type { EntityRef } from './pokemon';

export type PokemonSpecie = {
    base_happiness: number;
    capture_rate: number;
    color: EntityRef;
    egg_groups: EntityRef[];
    evolution_chain: { url: string };
    evolves_from_species?: EntityRef;
    flavor_text_entries: TextEntryRef[];
    form_description: any[];
    forms_switchable: boolean;
    gender_rate: number;
    genera: GeneraRef[];
    generation: EntityRef;
    habitai: EntityRef;
    has_gender_differences: boolean;
    hatch_counter: number;
    id: number;
    is_baby: boolean;
    is_legendary: boolean;
    is_mythical: boolean;
    name: string;
    names: LanguageRef[];
    order: number;
    pal_park_encounters: PalParkEncountersRef[];
    pokedex_numbers: PokedexNumbersRef[];
    shape: EntityRef;
    varieties: VarietyRef[];
};

type TextEntryRef = {
    flavor_text: string;
    language: EntityRef;
    version: EntityRef;
};

type GeneraRef = {
    genus: string;
    language: EntityRef;
};

type LanguageRef = {
    language: EntityRef;
    name: string;
};

type PalParkEncountersRef = {
    area: EntityRef;
    base_score: number;
    rate: number;
};

type PokedexNumbersRef = {
    entry_number: number;
    pokedex: EntityRef;
};

export type VarietyRef = {
    is_default: boolean;
    pokemon: EntityRef;
};