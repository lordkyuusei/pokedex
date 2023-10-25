import type { LightTranslation } from "./common";

export type LightAbilitiesResults = {
    data: LightAbilitiesData;
}

type LightAbilitiesData = {
    pokemon_v2_ability: LightAbility[];
}

type LightAbility = {
    id: number;
    name: string;
    generation_id: number;
    pokemon_v2_abilitynames: LightTranslation[];
    pokemon_v2_abilityflavortexts_aggregate: {
        nodes: LightAbilityNode[];
    }
}

type LightAbilityNode = {
    flavor_text: string;
    pokemon_v2_language: { name: string }
}