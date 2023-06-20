import type { LightTranslation } from "./common";

export type LightItemResults = {
    data: LightItemData;
}

type LightItemData = {
    pokemon_v2_itempocket: LightPocketItem[]
}

type LightPocketItem = {
    pokemon_v2_itempocketnames: LightTranslation[],
    pokemon_v2_itemcategories: LightCategory[],
}

type LightCategory = {
    pokemon_v2_itemcategorynames: LightTranslation[],
    pokemon_v2_items: LightItem[]
}

type LightItem = {
    id: number,
    pokemon_v2_itemnames: LightTranslation[],
    pokemon_v2_itemgameindices_aggregate: { aggregate: { min: { generation_id: number } } }
}