import { lightkedex } from "./schemas/lightkemon";
import { lightmoves } from "./schemas/lightmoves";
import { lightabilities } from "./schemas/lightabilities";
import { lightlocations } from "./schemas/lightlocations";
import { lightgenerations } from "./schemas/lightgenerations";
import type { LocationArea, LocationNode } from "$lib/types/location";
import type { LightMove } from "$lib/types/lightmove";

export const getPokemonList = async (from: number, to: number) => {
    const pokemonList = await lightkedex.find().bulkById(from, to).exec();
    return JSON.stringify(pokemonList);
}

export const searchPokemonByName = async (pokemon: string) => {
    const pokemonList = await lightkedex.find()
        .or([
            { "name": { $regex: pokemon, $options: 'i' } },
            { "i18n.fr": { $regex: pokemon, $options: 'i' } },
            { "i18n.en": { $regex: pokemon, $options: 'i' } },
        ]).sort("id").exec();

    return JSON.stringify(pokemonList);
}

export const searchPokemonById = async (id: number) => {
    const pokemon = await lightkedex.find({ id }).exec();

    return JSON.stringify(pokemon);
}

export const getGenerationsList = async (from: number = 0, to: number = 10) => {
    try {
        const generationList = await lightgenerations.find().bulkByGen(from, to).exec();
        return JSON.stringify(generationList);
    } catch (error) {
        return "[]";
    }
}

export const getMoveTypesGeneration = async (id: number = 9) => {
    const typesList: any[] = await lightmoves.find().typeCountByGen(id).exec();

    const result = typesList.flatMap(x => x.moves).reduce((acc, next) => {
        const type = acc.get(next.moveType);
        acc.set(next.moveType, (type ?? 0) + 1)
        return acc;
    }, new Map<string, number>());

    return JSON.stringify(Array.from(result.entries()));
}

export const getMove = async (id: number) => {
    return JSON.stringify(await lightmoves.find().getMoveById(id).exec())
}

export const getMoves = async (generationId: number, moveNames: string[]) => {
    try {
        const results: LightMove[] = await lightmoves.aggregate([
            { $match: { id: { $lte: generationId } } },
            { $unwind: '$moves' },
            { $match: { 'moves.name': { $in: moveNames } } },
            {
                $group: {
                    _id: '$_id',
                    moves: { $push: '$moves' }
                }
            },
        ]).exec();

        return results.flatMap(result => result.moves);
    } catch (error) {
        console.error('Error fetching moves:', error);
        throw error;
    }
};

export const getAbilitiesLteGen = async (id: number = 10) => {
    const abilities = await lightabilities.find().getAbilitiesLteGen(id).exec();
    return JSON.stringify(abilities);
}

export const getLocationsFromVersion = async (version: string) => {
    const locations = await lightlocations.findOne().getByVersionGroup(version);
    return JSON.stringify(locations);
}

export const setCoordsForLocation = async (locationId: string, area: LocationArea, mapName: string) => {
    try {
        await lightlocations.updateOne(
            { 'regions.locations._id': locationId, 'regions.locations.areas.name': area.name },
            {
                $set: {
                    'regions.$[region].locations.$[location].mapName': mapName,
                    'regions.$[region].locations.$[location].areas.$[area].coords': area.coords
                },
            },
            { arrayFilters: [
                { 'region.locations': { $elemMatch: { _id: locationId } } },
                { 'location._id': locationId },
                { 'area.name': area.name },
            ] }
        );
    } catch (error) {
        console.error('Error updating coords:', error);
    }
}

export const setDefaultMapNameForLocation = async (location: LocationNode) => {
    try {
        await lightlocations.updateOne(
            { 'regions.locations._id': location._id },
            { $set: { 'regions.$[region].locations.$[location].mapName': location.mapName } },
        );
    } catch (error) {
        console.error('Error updating coords:', error);
    }

}

export const getMovesTypes = async (type: string) => {
    const moveList = await lightmoves.aggregate([
        {
            $project: {
                id: 1,
                moves: {
                    $filter: {
                        input: "$moves",
                        as: "move",
                        cond: { $eq: ["$$move.moveType", type] }
                    }
                }
            }
        }
    ]).exec()

    return JSON.stringify(moveList);
}