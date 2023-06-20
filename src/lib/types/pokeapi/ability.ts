import type { EntityRef } from './Pokemon';

export type PokemonAbility = {
    id: string;
    name: string;
    is_main_series: boolean;
    generation: EntityRef;
    names: NameRef[];
    effect_entries: EffectEntryRef[];
    effect_changes: EffectChangeRef[];
    flavor_text_entries: FlavorTextEntryRef[];
    pokemon: PokemonRef[];
};

type NameRef = {
    name: string;
    language: EntityRef;
};

type EffectEntryRef = {
    effect: string;
    short_effect?: string;
    language: EntityRef;
};

type EffectChangeRef = {
    effect_entries: EffectEntryRef[];
    version_group: EntityRef;
};

type FlavorTextEntryRef = {
    flavor_text: string;
    language: EntityRef;
    version_group: EntityRef;
};

type PokemonRef = {
    is_hidden: boolean;
    slot: number;
    pokemon: EntityRef;
};