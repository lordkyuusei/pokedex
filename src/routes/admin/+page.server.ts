import type { Actions } from "./$types";
import { syncAbilitiesList, syncGenerationList, syncMovesList, syncPokemonList } from "$lib/server/database/reducers";

export const actions = {
    syncPokemonList: async (event) => {
        const result = await syncPokemonList();

        return {
            name: "Pokemon",
            items: result
        }
    },
    syncGenerationsList: async (event) => {
        const result = await syncGenerationList();

        return {
            name: "Generation",
            items: result
        }
    },
    syncMovesList: async (event) => {
        const result = await syncMovesList();

        return {
            name: "Moves",
            items: result,
        }
    },
    syncAbilitiesList: async (event) => {
        const result = await syncAbilitiesList();

        return {
            name: "Abilities",
            items: result,
        }
    }
} satisfies Actions;