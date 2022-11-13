import type { MoveLight } from "./types/PokemonMove";

export type SortBy = {
    key: string;
    order: "asc" | "desc";
}

/* Sort functions. */
const sortOrderNbr = (a: number, b: number, order: string): number =>
    order === "asc" ? a - b : b - a;

const sortOrderStr = (a: string, b: string, order: string): number =>
    order === "asc" ? a.localeCompare(b) : b.localeCompare(a);

export const sortMethod = (a: MoveLight, b: MoveLight, sortBy: SortBy) =>
    [
        { name: 'level', sort: (a: MoveLight, b: MoveLight) => sortOrderNbr(a.level, b.level, sortBy.order) },
        { name: 'name', sort: (a: MoveLight, b: MoveLight) => sortOrderStr(a.name, b.name, sortBy.order) },
        { name: 'type', sort: (a: MoveLight, b: MoveLight) => sortOrderStr(a.type.name, b.type.name, sortBy.order) },
        { name: 'power', sort: (a: MoveLight, b: MoveLight) => sortOrderNbr(a.power, b.power, sortBy.order) },
        { name: 'accuracy', sort: (a: MoveLight, b: MoveLight) => sortOrderNbr(a.accuracy, b.accuracy, sortBy.order) },
        { name: 'pp', sort: (a: MoveLight, b: MoveLight) => sortOrderNbr(a.pp, b.pp, sortBy.order) },
    ]
        .find((item) => item.name === sortBy.key)
        ?.sort(a, b);

export const displaySortMethod = (sortOrder: string) =>
    [
        { name: 'asc', icon: '⬆️' },
        { name: 'desc', icon: '⬇️' }
    ].find((item) => item.name === sortOrder)?.icon;

/* Getters */
export const getVersion = (version: string) =>
    version
        .split(/[\s\/]/)
        .map((group, _, versions) => `${group.charAt(0).toUpperCase()}${versions.length === 1 ? group.charAt(1) : ''}`)
        .join('');

export const displayMove = (move: string) =>
    move
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

export const displayDamageClass = (damageClass: string) =>
    [
        { name: 'physical', icon: '🔪' },
        { name: 'special', icon: '🔮' },
        { name: 'status', icon: '💉' }
    ].find((item) => item.name === damageClass)?.icon;
