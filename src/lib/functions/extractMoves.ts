import type { LightMoveDetails } from "$lib/types/lightmove";
import type { SortOption } from "$lib/types/moves";
import type { MoveLight } from "$lib/types/pokeapi/move";
import type { MoveLearnMethodRef, MoveRef } from "$lib/types/pokeapi/pokemon";

export const extractMovesV2 = (pkmnMoves: MoveRef[], movesData: LightMoveDetails[], version: string): MoveLight[] => {
    return pkmnMoves.reduce((movesList, currentMove) => {
        const { move, version_group_details } = currentMove;

        const details: MoveLearnMethodRef | undefined = version_group_details.find(v => v.version_group.name === version);
        if (!details) return movesList;

        const matchingMove = movesData.find(data => move.name === data.name);
        if (!matchingMove) return movesList;

        const moveData: MoveLight = {
            id: matchingMove.id.toString(),
            level: details.level_learned_at,
            name: matchingMove.i18n,
            type: { name: matchingMove.moveType, url: '' },
            method: details.move_learn_method,
            power: matchingMove.power,
            accuracy: matchingMove.accuracy,
            pp: matchingMove.pp,
            category: matchingMove.damageClass,
            damageClass: matchingMove.damageClass,
        };

        return [...movesList, moveData];
    }, [] as any[]);
}

export const filterMoves = (moves: MoveLight[], option: string): MoveLight[] =>
    moves.filter(m => m.method.name === option);

/* Sort functions. */
const sortOrderNbr = (a: number, b: number, direction: string): number =>
    direction === "asc" ? a - b : b - a;

const sortOrderStr = (a: string, b: string, direction: string): number =>
    direction === "asc" ? a.localeCompare(b) : b.localeCompare(a);

export const sortBy = (a: MoveLight, b: MoveLight, sortByOption: SortOption, lang: string) => {
    const sortOptions = [
        { name: 'level', sort: (a: MoveLight, b: MoveLight) => sortOrderNbr(a.level, b.level, sortByOption.direction) },
        { name: 'name', sort: (a: MoveLight, b: MoveLight) => sortOrderStr(a.name[lang], b.name[lang], sortByOption.direction) },
        { name: 'type', sort: (a: MoveLight, b: MoveLight) => sortOrderStr(a.type.name, b.type.name, sortByOption.direction) },
        { name: 'power', sort: (a: MoveLight, b: MoveLight) => sortOrderNbr(a.power, b.power, sortByOption.direction) },
        { name: 'accuracy', sort: (a: MoveLight, b: MoveLight) => sortOrderNbr(a.accuracy, b.accuracy, sortByOption.direction) },
        { name: 'pp', sort: (a: MoveLight, b: MoveLight) => sortOrderNbr(a.pp, b.pp, sortByOption.direction) },
    ];

    const sortOption = sortOptions.find((item) => item.name === sortByOption.option);
    if (!sortOption) return -1;

    return sortOption.sort(a, b);
}

export const searchMoves = (moves: MoveLight[], searchText: string, sortOption: any, lang: string): MoveLight[] =>
    [...moves.filter(m => {
        const moveName = m.name[lang] ?? "???";
        return searchText.length ? moveName.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) : moveName
    })]
        .sort((a, z) => sortBy(a, z, sortOption, lang));
