export type PokemonNatureLight = {
    name: string;
    increase: string;
    decrease: string;
};

const POKEMON_NATURES = [
    // get all natures with increasing and decreasing stats
    {
        name: 'Adamant',
        increase: 'attack',
        decrease: 'special-attack'
    },
    {
        name: 'Bashful',
        increase: '',
        decrease: ''
    },
    {
        name: 'Bold',
        increase: 'defense',
        decrease: 'attack'
    },
    {
        name: 'Brave',
        increase: 'attack',
        decrease: 'speed'
    },
    {
        name: 'Calm',
        increase: 'special-defense',
        decrease: 'attack'
    },
    {
        name: 'Careful',
        increase: 'special-defense',
        decrease: 'special-attack'
    },
    {
        name: 'Docile',
        increase: '',
        decrease: ''
    },
    {
        name: 'Gentle',
        increase: 'special-defense',
        decrease: 'defense'
    },
    {
        name: 'Hardy',
        increase: '',
        decrease: ''
    },
    {
        name: 'Hasty',
        increase: 'speed',
        decrease: 'defense'
    },
    {
        name: 'Impish',
        increase: 'defense',
        decrease: 'special-attack'
    },
    {
        name: 'Jolly',
        increase: 'speed',
        decrease: 'special-attack'
    },
    {
        name: 'Lax',
        increase: 'defense',
        decrease: 'special-defense'
    },
    {
        name: 'Lonely',
        increase: 'attack',
        decrease: 'defense'
    },
    {
        name: 'Mild',
        increase: 'special-attack',
        decrease: 'defense'
    },
    {
        name: 'Modest',
        increase: 'special-attack',
        decrease: 'attack'
    },
    {
        name: 'Naive',
        increase: 'speed',
        decrease: 'special-defense'
    },
    {
        name: 'Naughty',
        increase: 'attack',
        decrease: 'special-defense'
    },
    {
        name: 'Quiet',
        increase: 'special-attack',
        decrease: 'speed'
    },
    {
        name: 'Quirky',
        increase: '',
        decrease: ''
    },
    {
        name: 'Rash',
        increase: 'special-attack',
        decrease: 'special-defense'
    },
    {
        name: 'Relaxed',
        increase: 'defense',
        decrease: 'speed'
    },
    {
        name: 'Sassy',
        increase: 'special-defense',
        decrease: 'speed'
    },
    {
        name: 'Serious',
        increase: '',
        decrease: ''
    },
    {
        name: 'Timid',
        increase: 'speed',
        decrease: 'attack'
    }
];

export default POKEMON_NATURES;