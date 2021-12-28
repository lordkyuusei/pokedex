import type { EntityRef, TypeRef } from "./Pokemon";

export type PokemonForm = {
    id: string;
    name: string;
    order: number;
    form_order: number;
    is_default: boolean;
    is_battle_only: boolean;
    is_mega: boolean;
    form_name: string;
    pokemon: EntityRef;
    types: TypeRef[];
    sprites: PokemonFormSprites;
    version_group: EntityRef;
    names: Name[];
    form_names: Name[];
}

type PokemonFormSprites = {
    front_default: string;
    front_shiny: string;
    back_default: string;
    back_shiny: string;
}

type Name = {
    name: string;
    language: EntityRef;
}