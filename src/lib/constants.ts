// URLS
export const BASE_URL = 'https://pokeapi.co/api/v2';
export const SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
export const ITEMS_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/';

// NUMBERS
export const MAX_POKEMON_LOADING = 30;
export const MAX_STAT_VALUE = 255;
export const DEFAULT_POKEMON_OFFSET = 0;
export const DEFAULT_OFFSET_INCREMENT = 30;

// OBJECTS
export const GENERATION_BOUNDARIES = [
    { start: 0, end: 151 },
    { start: 152, end: 251 },
    { start: 252, end: 386 },
    { start: 387, end: 493 },
    { start: 494, end: 649 },
    { start: 650, end: 721 },
    { start: 722, end: 809 },
    { start: 810, end: 898 },
];

export const EGG_GROUPS = [
    { group: 'monster', icon: '👾' },
    { group: 'water1', icon: '💧' },
    { group: 'bug', icon: '🐛' },
    { group: 'flying', icon: '🐦' },
    { group: 'ground', icon: '🐕' },
    { group: 'fairy', icon: '🧚‍♀️' },
    { group: 'plant', icon: '🌿' },
    { group: 'humanshape', icon: '👥' },
    { group: 'mineral', icon: '🪨' },
    { group: 'water3', icon: '💦' },
    { group: 'indeterminate', icon: '〰️' },
    { group: 'water2', icon: '💧💧' },
    { group: 'ditto', icon: '💡' },
    { group: 'dragon', icon: '🐲' },
    { group: 'no-eggs', icon: '❌' },
];
