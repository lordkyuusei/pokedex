export type FactoryPokemon = {
    "id": number,
    "name": string,
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
    "meta": {
        "isStarred": boolean
    }
}