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
    pokemon_v2_pokemonspeciesnames: LightTranslation[],
    pokemon_v2_pokemondexnumbers: LightDexNumber[],
}

type LightDexNumber = {
    pokedex_number: number,
    pokemon_v2_pokedex: {
        pokemon_v2_pokedexversiongroups: LightVersionGroup[]
    }
}

type LightVersionGroup = {
    pokemon_v2_versiongroup: { name: string }
}