import type { LightTranslation } from "./common"

export type LightPokemonResults = {
    data: LightPokemonResult,
}

type LightPokemonResult = {
    pokemon_v2_pokemon: LightPokemon[]
}

type LightPokemon = {
    id: number,
    name: string,
    pokemon_v2_pokemontypes: LightPokemonTypes[],
    pokemon_v2_pokemonspecy: LightPokemonSpecy
}

type LightPokemonTypes = {
    pokemon_v2_type: { name: string }
}

type LightPokemonSpecy = {
    pokemon_v2_pokemonspeciesnames: LightTranslation[]
}