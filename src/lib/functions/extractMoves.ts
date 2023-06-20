import { fetchPokemonMove } from "$lib/api/fetch";
import type { SortOption } from "$lib/types/moves";
import type { MoveLight, PokemonMove } from "$lib/types/pokeapi/move";
import type { MoveLearnMethodRef, MoveRef } from "$lib/types/pokeapi/pokemon";

export const extractMoves = async (refs: MoveRef[] = [], version: string): Promise<MoveLight[]> => {
    const reducedMoves = refs.reduce(async (moves, ref) => {
        const { move, version_group_details } = ref;

        const details: MoveLearnMethodRef | undefined = version_group_details.find(v => v.version_group.name === version);
        if (!details) {
            return await moves;
        }

        const fullMove: PokemonMove = await fetchPokemonMove(move.name);
        const lightMove: MoveLight = {
            id: fullMove.id,
            level: details.level_learned_at,
            name: fullMove.names
                .filter(x => ['fr', 'en'].includes(x.language.name))
                .reduce((acc, next) => ({ ...acc, [next.language.name]: next.name }), {}),
            type: fullMove.type,
            method: details.move_learn_method,
            accuracy: fullMove.accuracy,
            power: fullMove.power,
            pp: fullMove.pp,
            category: fullMove.meta?.category.name,
            damageClass: fullMove.damage_class.name,
            description: fullMove.flavor_text_entries
                .filter(x => ['fr', 'en'].includes(x.language.name))
                .reduce((acc, next) => ({ ...acc, [next.language.name]: next.flavor_text }), {}),
        };
        return [...await moves, lightMove];
    }, [] as any)

    return await reducedMoves;
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
        return moveName.toLocaleLowerCase().includes(searchText.toLocaleLowerCase());
    })]
        .sort((a, z) => sortBy(a, z, sortOption, lang));
