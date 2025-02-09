import type { Ability } from "./abilitiy"
import type { Lightkemon } from "./lightkemon"
import type { LightMoveDetails } from "./lightmove"

export type SearchResult = {
    pokemonList: Lightkemon[],
    abilityList: Ability[],
    movesList: LightMoveDetails[]
}