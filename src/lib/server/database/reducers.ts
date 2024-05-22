import { fetchAbilitiesList, fetchGenerationsList, fetchLocationsList, fetchMovesList, fetchPokemonList } from "$lib/server/api/pokeapiql";
import type { Generation } from "$lib/types/generation";
import type { LightAbilitiesResults } from "$lib/types/graphql/lightabilities";
import type { LightGenerationResults } from "$lib/types/graphql/lightgenerations";
import type { LightLocationsResults } from "$lib/types/graphql/lightlocations";
import type { LightMoveResults } from "$lib/types/graphql/lightmove";
import type { LightPokemonResults } from "$lib/types/graphql/lightpokemon";
import { lightabilities, lightgenerations, lightkedex, lightlocations, lightmoves } from "./schemas";

const parseGenerationsList = (rawGenerationsList: LightGenerationResults): Generation[] => {
    const result: Generation[] = rawGenerationsList.data.pokemon_v2_generation.map(g => ({
        id: g.id,
        name: g.name,
        boundaries: {
            from: g.pokemon_v2_pokemonspecies_aggregate.aggregate.min.id,
            to: g.pokemon_v2_pokemonspecies_aggregate.aggregate.max.id
        },
        region: {
            name: g.pokemon_v2_region.name,
            i18n: g.pokemon_v2_region.pokemon_v2_regionnames.reduce((prev, next) => {
                prev[next.pokemon_v2_language.name] = next.name;
                return prev;
            }, {} as { fr: string, en: string, [x: string]: string })
        },
        versionsGroup: g.pokemon_v2_versiongroups.map(v => ({
            name: v.name,
            games: v.pokemon_v2_versions.map(v => ({
                name: v.name,
                i18n: v.pokemon_v2_versionnames.reduce((prev, next) => {
                    prev[next.pokemon_v2_language.name] = next.name;
                    return prev;
                }, {} as { fr: string, en: string, [x: string]: string })
            })),
            pokedexes: v.pokemon_v2_pokedexversiongroups.map(p => ({
                id: p.pokedex_id,
                name: p.pokemon_v2_pokedex.name
            }))
        })),
        i18n: g.pokemon_v2_generationnames.reduce((prev, next) => {
            prev[next.pokemon_v2_language.name] = next.name;
            return prev;
        }, {} as { fr: string, en: string, [x: string]: string })
    }));

    return result;
}

const parsePokemonList = (rawPokemonList: LightPokemonResults) =>
    rawPokemonList.data.pokemon_v2_pokemon.map(p => ({
        id: p.id,
        name: p.name,
        types: p.pokemon_v2_pokemontypes.map(t => t.pokemon_v2_type.name),
        i18n: p.pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesnames.reduce((prev, next) => {
            prev[next.pokemon_v2_language.name] = next.name;
            return prev;
        }, {})
    }));

const parseMovesList = (rawMovesList: LightMoveResults) =>
    rawMovesList.data.pokemon_v2_generation.map(g => ({
        id: g.id,
        name: g.name,
        moves: g.pokemon_v2_moves.map(m => ({
            id: m.id,
            name: m.name,
            power: m.power ?? 0,
            accuracy: m.accuracy ?? 0,
            pp: m.pp,
            moveType: m.pokemon_v2_type.name,
            damageClass: m.pokemon_v2_movedamageclass.name,
            i18n: m.pokemon_v2_movenames.reduce((prev, next) => {
                prev[next.pokemon_v2_language.name] = next.name;
                return prev;
            }, {})
        }))
    }));

const parseAbilitiesList = (rawAbilitiesList: LightAbilitiesResults) =>
    rawAbilitiesList.data.pokemon_v2_ability.map(g => ({
        id: g.id,
        name: g.name,
        generation: g.generation_id,
        i18nName: g.pokemon_v2_abilitynames.reduce((prev, next) => {
            prev[next.pokemon_v2_language.name] = next.name ?? "";
            return prev;
        }, {}),
        i18nFlavor: g.pokemon_v2_abilityflavortexts_aggregate.nodes.reduce((prev, next) => {
            prev[next.pokemon_v2_language.name] = next.flavor_text ?? "";
            return prev;
        }, {}),
    }))

const parseLocationsList = (rawLocationsList: LightLocationsResults) =>
    rawLocationsList.data.pokemon_v2_versiongroup.map(vg => ({
        name: vg.name,
        generation: vg.generation_id,
        regions: vg.pokemon_v2_versiongroupregions.map(r => ({
            name: r.pokemon_v2_region.name,
            locations: r.pokemon_v2_region.pokemon_v2_locations.map(l => ({
                id: l.name,
                areas: l.pokemon_v2_locationareas.map(a => ({
                    id: a.id,
                    name: a.name,
                    i18nName: a.pokemon_v2_locationareanames.reduce((prev, next) => {
                        prev[next.pokemon_v2_language.name] = next.name ?? "";
                        return prev;
                    }, {}),
                }))
            }))
        }))
    }));

export const syncGenerationList = async () => {
    try {
        const rawGenerationsList: LightGenerationResults = await fetchGenerationsList();
        const generationsList = parseGenerationsList(rawGenerationsList);
        await lightgenerations.deleteMany().exec();

        generationsList
            .map(gen => new lightgenerations(gen))
            .forEach(async (gen) => await gen.save());

        return generationsList.length;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export const syncPokemonList = async () => {
    try {
        const rawPokemonList: LightPokemonResults = await fetchPokemonList();
        const pokemonList = parsePokemonList(rawPokemonList);
        await lightkedex.deleteMany().exec();
        pokemonList
            .map(pokemon => new lightkedex(pokemon))
            .forEach(async (pokemon) => await pokemon.save());

        return pokemonList.length;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export const syncMovesList = async () => {
    try {
        const rawMovesList: LightMoveResults = await fetchMovesList();
        const movesList = parseMovesList(rawMovesList);
        await lightmoves.deleteMany().exec();
        movesList
            .map(move => new lightmoves(move))
            .forEach(async (move) => await move.save());

        return movesList.reduce((acc, next) => acc + next.moves.length, 0);
    } catch (err) {
        return false;
    }
}

export const syncAbilitiesList = async () => {
    try {
        const rawAbilitiesList: LightAbilitiesResults = await fetchAbilitiesList();
        const abilitiesList = parseAbilitiesList(rawAbilitiesList);
        await lightabilities.deleteMany().exec();
        abilitiesList
            .map(ability => new lightabilities(ability))
            .forEach(async (ability) => await ability.save());

        return abilitiesList.length;
    } catch (err) {
        return false;
    }
}

export const syncLocationsList = async () => {
    try {
        const rawLocationsList: LightLocationsResults = await fetchLocationsList();
        const locationsList = parseLocationsList(rawLocationsList);
        await lightlocations.deleteMany().exec();
        locationsList
            .map(location => new lightlocations(location))
            .forEach(async (location) => await location.save());

        return locationsList.length;
    } catch (err) {
        return false;
    }
}