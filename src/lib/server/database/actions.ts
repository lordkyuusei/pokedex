import { lightkedex } from "./schemas/lightkemon";
import { lightmoves } from "./schemas/lightmoves";
import { lightabilities } from "./schemas/lightabilities";
import { lightlocations } from "./schemas/lightlocations";
import { lightgenerations } from "./schemas/lightgenerations";
import type { LocationArea, LocationNode } from "$lib/types/location";
import type { LightMove, LightMoveDetails } from "$lib/types/lightmove";
import type { Ability } from "$lib/types/abilitiy";
import type { Lightkemon } from "$lib/types/lightkemon";

export const getPokemonList = async (from: number, to: number, game: string | null) => {
    if (!game) {
        return JSON.stringify(await lightkedex.find().where("id").gte(from).lte(to).sort("id"));
    }

    return JSON.stringify(
        await lightkedex.aggregate([
            { $match: { "dexes.games": game } },
            {
                $addFields: {
                    dexes: {
                        $filter: {
                            input: "$dexes",
                            as: "dex",
                            cond: {
                                $and: [
                                    { $in: [game, "$$dex.games"] },
                                    { $gte: ["$$dex.number", from] },
                                    { $lte: ["$$dex.number", to] },
                                ]
                            }
                        }
                    }
                }
            },
            { $unwind: "$dexes" }, // Flatten the dexes array
            {
                $group: {
                    _id: "$dexes.number", // Group by dexes.number
                    document: { $first: "$$ROOT" } // Keep only the first occurrence
                }
            },
            { $replaceRoot: { newRoot: "$document" } },
            { $sort: { "dexes.number": 1 } }
        ]));
}

export const searchEntityByNameOrId = async (name: string): Promise<string> => {
    const inputAsNumber = Number(name);
    const input = isNaN(inputAsNumber) ? name : inputAsNumber;

    const pokemonList = await searchPokemonByName(input);
    const abilityList = await searchAbilityByName(input);
    const movesList = await searchMoveByName(input);
    console.log(movesList)

    return JSON.stringify({
        pokemonList,
        abilityList,
        movesList
    });
}

export const searchAbilityByName = async (name: string | number): Promise<Ability[]> => {
    if (typeof name === "number") return await lightabilities.find({ id: name }).exec();

    return await lightabilities.find()
        .or([
            { "name": { $regex: name, $options: 'i' } },
            { "i18nName.fr": { $regex: name, $options: 'i' } },
            { "i18nName.en": { $regex: name, $options: 'i' } },
        ]).sort("id").exec();
}

const searchMoveByName = async (name: string | number): Promise<LightMoveDetails[]> => {
    if (typeof name === "number") return await lightmoves.find({ id: name }).exec();

    const moves = await lightmoves.aggregate([
        { $unwind: '$moves' },
        { $match: {
            $or: [
                { "moves.name": { $regex: name, $options: 'i' } },
                { "moves.i18n.fr": { $regex: name, $options: 'i' } },
                { "moves.i18n.en": { $regex: name, $options: 'i' } },
            ]
        }},
        { $group: { _id: null, moves: { $addToSet: "$moves" } } },
        { $project: { _id: 0, moves: 1 } }
    ]);

    return moves[0]?.moves ?? []
}

const searchPokemonByName = async (name: string | number): Promise<Lightkemon[]> => {
    if (typeof name === "number") return await lightkedex.find({ id: name }).exec();

    return await lightkedex.find()
        .or([
            { "name": { $regex: name, $options: 'i' } },
            { "i18n.fr": { $regex: name, $options: 'i' } },
            { "i18n.en": { $regex: name, $options: 'i' } },
        ]).sort("id").exec();
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
            {
                arrayFilters: [
                    { 'region.locations': { $elemMatch: { _id: locationId } } },
                    { 'location._id': locationId },
                    { 'area.name': area.name },
                ]
            }
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