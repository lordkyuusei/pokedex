import type { LightMoveDetails } from "./lightmove"

export type FactoryPokemonRaw = {
    "id": number,
    "dexId": number,
    "name": string,
    "types": string[],
    "variant": number,
    "nature": string,
    "item": string,
    "1stMove": string,
    "2ndMove": string,
    "3rdMove": string,
    "4thMove": string,
    "ability": string,
    "evs": [number, number, number, number, number, number],
    "lv100Stats": [number, number, number, number, number, number],
    "lv50Stats": [number, number, number, number, number, number],
    "i18n": { fr: string, en: string }
}

export type FactoryPokemon = {
    "id": number,
    "dexId": number,
    "name": string,
    "types": string[],
    "variant": number,
    "nature": string,
    "item": string,
    "moves": (LightMoveDetails & { style?: number })[]
    "ability": string,
    "evs": [number, number, number, number, number, number],
    "lv100MaxStats": [number, number, number, number, number, number],
    "lv100Stats": [number, number, number, number, number, number],
    "lv50MaxStats": [number, number, number, number, number, number],
    "lv50Stats": [number, number, number, number, number, number],
    "i18n": { fr: string, en: string }
    "meta": {
        "isOpponent": boolean
        "isTeamed": boolean,
        "isRental": boolean,
        "isTeamSelected": boolean,
        "isOpponentSelected": boolean,
    }
}