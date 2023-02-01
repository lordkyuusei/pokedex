export const routesList: any[] = [
    {
        name: 'menu.skip',
        path: '/#kyuudex-main',
        icon: 'skip',
    },
    {
        name: 'menu.pokedex',
        path: '/pokedex',
        icon: 'codex'
    },
    {
        name: 'menu.about',
        path: '/about',
        icon: 'info'
    },
];

const pokemonGenerations = [
    { name: "I", start: 1, limit: 151 },
    { name: "II", start: 152, limit: 99 },
    { name: "III", start: 252, limit: 134 },
    { name: "IV", start: 387, limit: 106 },
    { name: "V", start: 494, limit: 155 },
    { name: "VI", start: 650, limit: 71 },
    { name: "VII", start: 722, limit: 87 },
    { name: "VIII", start: 810, limit: 88 },
    { name: "IX", start: 906, limit: 100 },
];

export const pokemonList: any[] = pokemonGenerations.map((gen) =>
({
    name: `menu.generation.${gen.name}`,
    path: `/pokedex?_offset=${gen.start}&_limit=${gen.limit}`,
    icon: 'codex'
}));