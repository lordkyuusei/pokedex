import type { FactoryPokemon, FactoryPokemonRaw } from "$lib/types/battle-factory";
import type { Lightkemon } from "$lib/types/lightkemon";

const parseHeading = (index: number, value: string) => {
    const mapIndexToFunction = [
        { index: 0, heading: 'id' },
        { index: 1, heading: 'name' },
        { index: 2, heading: 'variant' },
        { index: 3, heading: 'nature' },
        { index: 4, heading: 'item' },
        { index: 5, heading: '1stMove' },
        { index: 6, heading: '2ndMove' },
        { index: 7, heading: '3rdMove' },
        { index: 8, heading: '4thMove' },
        { index: 9, heading: 'ability' },
        { index: 10, heading: 'evs' },
        { index: 11, heading: 'lv100Stats' },
        { index: 13, heading: 'lv50Stats' }
    ];

    return mapIndexToFunction.find((x) => x.index === index)?.heading ?? value;
};

const parseCell = (index: number, value: string) => {
    const mapIndexToFunction = [
        { index: 0, fx: (value: string) => Number(value) ?? 0 },
        { index: 2, fx: (value: string) => Number(value) ?? 0 },
        { index: 10, fx: (value: string) => value.replace(' ', '').split('/').map(Number) },
        { index: 11, fx: (value: string) => value.split('/').map(Number) },
        { index: 13, fx: (value: string) => value.split('/').map(Number) }
    ];

    return mapIndexToFunction.find((x) => x.index === index)?.fx(value) ?? value;
};

export const loadBattleFrontierRoster = (battleFrontierSheet: string, references: Lightkemon[]): FactoryPokemonRaw[] => {
    const parser = new DOMParser();

    const pageHtml = parser.parseFromString(battleFrontierSheet, 'text/html');

    const pokemonRows: NodeListOf<HTMLTableRowElement> = pageHtml.querySelectorAll('table.aaa>tbody>tr');
    const trainerRows: NodeListOf<HTMLTableRowElement> = pageHtml.querySelectorAll('table.aar>tbody>tr');

    console.log(trainerRows);
    const [head, ...body] = Array.from(pokemonRows);
    const cells = head.querySelectorAll('td');
    const headers = Array.from(cells).map((x) => x.innerText);

    const pokemonsFromSheet = Array.from(body).reduce((json, row) => {
        const cells = row.querySelectorAll('td');
        const values = Array.from(cells).map((x) => x.innerText);

        if (values.every((x) => x === '') || values[1] === '') return json;
        return [
            ...json,
            headers.reduce(
                (obj, heading, i) => ({
                    ...obj,
                    [parseHeading(i, heading)]: parseCell(i, values[i])
                }), {} as FactoryPokemonRaw)
        ];
    }, [] as FactoryPokemonRaw[]);

    return pokemonsFromSheet.map(p => {
        const reference = references.find(r => r.i18n.en === p.name || (r.name === 'farfetchd' && p.name === "Farfetch'd"));

        if (!reference) return p;

        const nationalDex = reference.dexes.find(d => d.games.length === 0);
        if (!nationalDex) return p;

        return {
            ...p,
            dexId: nationalDex.number,
            types: reference.types.includes('fairy') ? (reference.types.length === 2 ? reference.types.filter(t => t !== 'fairy') : ['normal']) : reference.types,
            i18n: reference.i18n
        }
    })
};
