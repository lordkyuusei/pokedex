export type Pokemon = {
    abilities: AbilityRef[],
    base_experience: number,
    forms: EntityRef[],
    game_indices: GameRef[],
    height: number,
    held_items: HeldItemRef[],
    id: number,
    is_default: boolean,
    location_area_encounters: string,
    moves: MoveRef[],
    name: string,
    order: number,
    past_types: PastTypesRef[],
    species: EntityRef,
    sprites: SpritesRef,
    stats: StatRef[],
    types: TypeRef[],
};

export type AbilityRef = {
    ability: EntityRef,
    is_hidden: boolean,
    slot: number,
};

export type HeldItemRarityRef = {
    rarity: number,
    version: EntityRef,
};

export type HeldItemRef = {
    item: EntityRef,
    version_details: HeldItemRarityRef[],
};

export type GameRef = {
    game_index: number,
    version: EntityRef,
};

export type MoveRef = {
    move: EntityRef,
    version_group_details: MoveLearnMethodRef[];
};

export type MoveLearnMethodRef = {
    level_learned_at: number,
    move_learn_method: EntityRef,
    version_group: EntityRef,
};

export type PastTypesRef = {
    generation: EntityRef,
    types: TypeRef[];
};

export type MainSpritesRef = {
    front_default: string,
    front_female?: string,
    front_gray?: string,
    front_shiny?: string,
    front_shiny_female?: string,
    back_default: string,
    back_female?: string,
    back_gray?: string,
    back_shiny?: string,
    back_shiny_female?: string,
};

export type SpritesRef = MainSpritesRef & {
    other: OtherSpritesRef,
    versions: VersionsSpritesRef,
}

// As of 24/11/2021: dream_world, home, official-artwork
export type OtherSpritesRef = {
    [key: string]: MainSpritesRef,
}

// As of 24/11/2021: generation-i - generation-viii
export type VersionsSpritesRef = {
    [key: string]: OtherSpritesRef,
}

export type StatRef = {
    base_stat: number,
    effort: number,
    stat: EntityRef,
};

export type TypeRef = {
    slot: number,
    type: EntityRef,
};

export type EntityRef = {
    name: string,
    url: string,
};