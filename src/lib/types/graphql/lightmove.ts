import type { LightTranslation } from "./common";

export type LightMoveResults = {
    data: LightMoveData;
}

type LightMoveData = {
    pokemon_v2_generation: LightMoveGeneration[];
}

type LightMoveGeneration = {
    id: number;
    name: string;
    pokemon_v2_moves: LightMove[];
}

type LightMove = {
    id: number;
    name: string;
    power: number;
    accuracy: number;
    pp: number;
    pokemon_v2_movedamageclass: { name: string };
    pokemon_v2_type: { name: string };
    pokemon_v2_movenames: LightTranslation[];
}