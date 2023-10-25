import type { EntityRef } from "./pokemon";

export type PokemonLocation = {
    id: number;
    name: string;
    region: EntityRef;
    names: NameRef[];
    game_indices: GameRef[];
    areas: EntityRef[];
}

type NameRef = {
    name: string;
    language: EntityRef;
};

export type GameRef = {
    game_index: number;
    version: EntityRef;
};