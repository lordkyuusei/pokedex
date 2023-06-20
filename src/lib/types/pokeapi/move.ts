import type { EntityRef, MoveRef } from "./pokemon";

export type PokemonMove = {
    id: string;
    name: string;
    accuracy: number;
    effect_chance?: number;
    pp: number;
    priority: number;
    power: number;
    contest_combo: any;
    contest_type: EntityRef;
    contest_effect: ContestEffect;
    damage_class: EntityRef;
    effect_entries: EffectEntry[];
    effect_changes: EffectChange[];
    generation: EntityRef;
    meta: Meta;
    names: MoveName[];
    past_values: PastValue[];
    stat_changes: StatChange[];
    super_contest_effect: SuperContestEffect;
    target: EntityRef;
    type: EntityRef;
    learned_by_pokemon: EntityRef[];
    flavor_text_entries: FlavorTextEntry[];
}

export type MoveLight = {
    id: string;
    name: { [x: string]: string };
    level: number;
    method: EntityRef;
    type?: EntityRef;
    power?: number;
    accuracy?: number;
    pp?: number;
    description: { [x: string]: string };
    category?: string;
    damageClass?: string;
};

type ContestEffect = {
    url: string;
}

type EffectEntry = {
    effect: string;
    short_effect: string;
    language: EntityRef;
}

type EffectChange = {
    version_group: EntityRef;
    effect_entries: EffectEntry[];
}

type Meta = {
    ailment: EntityRef;
    category: EntityRef;
    min_hits: number;
    max_hits: number;
    min_turns: number;
    max_turns: number;
    drain: number;
    healing: number;
    crit_rate: number;
    ailment_chance: number;
    flinch_chance: number;
    stat_chance: number;
}

type MoveName = {
    name: string;
    language: EntityRef;
}

type PastValue = {
    gen: number;
    move_learn_method: EntityRef;
    version_group: EntityRef;
    level_learned_at: number;
};

type StatChange = {
    change: number;
    stat: EntityRef;
};

type SuperContestEffect = {
    appeal: number;
    jam: number;
};

type FlavorTextEntry = {
    flavor_text: string;
    language: EntityRef;
    version_group: EntityRef;
};