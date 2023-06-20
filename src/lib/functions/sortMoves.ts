import type { MoveLight } from "$lib/types/pokeapi/move";

export type SortBy = {
    key: string;
    order: boolean;
}

/* Sort functions. */
const sortOrderNbr = (a: number, b: number, order: boolean): number =>
    order ? a - b : b - a;

const sortOrderStr = (a: string, b: string, order: boolean): number =>
    order ? a.localeCompare(b) : b.localeCompare(a);

export const sortMethod = (a: MoveLight, b: MoveLight, sortBy: SortBy) =>
    [
        { name: 'level', sort: (a: MoveLight, b: MoveLight) => sortOrderNbr(a.level, b.level, sortBy.order) },
        { name: 'name', sort: (a: MoveLight, b: MoveLight) => sortOrderStr(a.name, b.name, sortBy.order) },
        { name: 'type', sort: (a: MoveLight, b: MoveLight) => sortOrderStr(a.type.name, b.type.name, sortBy.order) },
        { name: 'power', sort: (a: MoveLight, b: MoveLight) => sortOrderNbr(a.power, b.power, sortBy.order) },
        { name: 'accuracy', sort: (a: MoveLight, b: MoveLight) => sortOrderNbr(a.accuracy, b.accuracy, sortBy.order) },
        { name: 'pp', sort: (a: MoveLight, b: MoveLight) => sortOrderNbr(a.pp, b.pp, sortBy.order) },
    ].find((item) => item.name === sortBy.key)?.sort(a, b);