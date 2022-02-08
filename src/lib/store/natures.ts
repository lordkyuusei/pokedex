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
        inc_short: 'atk',
        decrease: 'special-attack',
        dec_short: 'spa',
    },
    {
        name: 'Bashful',
        increase: '',
        inc_short: '',
        decrease: '',
        dec_short: '',
    },
    {
        name: 'Bold',
        increase: 'defense',
        inc_short: 'def',
        decrease: 'attack',
        dec_short: 'atk',
    },
    {
        name: 'Brave',
        increase: 'attack',
        inc_short: 'atk',
        decrease: 'speed',
        dec_short: 'spe',
    },
    {
        name: 'Calm',
        increase: 'special-defense',
        inc_short: 'spd',
        decrease: 'attack',
        dec_short: 'atk',
    },
    {
        name: 'Careful',
        increase: 'special-defense',
        inc_short: 'spd',
        decrease: 'special-attack',
        dec_short: 'spa',
    },
    {
        name: 'Docile',
        increase: '',
        inc_short: '',
        decrease: '',
        dec_short: '',
    },
    {
        name: 'Gentle',
        increase: 'special-defense',
        inc_short: 'spd',
        decrease: 'defense',
        dec_short: 'def',
    },
    {
        name: 'Hardy',
        increase: '',
        inc_short: '',
        decrease: '',
        dec_short: '',
    },
    {
        name: 'Hasty',
        increase: 'speed',
        inc_short: 'spe',
        decrease: 'defense',
        dec_short: 'def',
    },
    {
        name: 'Impish',
        increase: 'defense',
        inc_short: 'def',
        decrease: 'special-attack',
        dec_short: 'spa',
    },
    {
        name: 'Jolly',
        increase: 'speed',
        inc_short: 'spe',
        decrease: 'special-attack',
        dec_short: 'spa',
    },
    {
        name: 'Lax',
        increase: 'defense',
        inc_short: 'def',
        decrease: 'special-defense',
        dec_short: 'spd',
    },
    {
        name: 'Lonely',
        increase: 'attack',
        inc_short: 'atk',
        decrease: 'defense',
        dec_short: 'def',
    },
    {
        name: 'Mild',
        increase: 'special-attack',
        inc_short: 'spa',
        decrease: 'defense',
        dec_short: 'def',
    },
    {
        name: 'Modest',
        increase: 'special-attack',
        inc_short: 'spa',
        decrease: 'attack',
        dec_short: 'atk',
    },
    {
        name: 'Naive',
        increase: 'speed',
        inc_short: 'spe',
        decrease: 'special-defense',
        dec_short: 'spd',
    },
    {
        name: 'Naughty',
        increase: 'attack',
        inc_short: 'atk',
        decrease: 'special-defense',
        dec_short: 'spd',
    },
    {
        name: 'Quiet',
        increase: 'special-attack',
        inc_short: 'spa',
        decrease: 'speed',
        dec_short: 'spe',
    },
    {
        name: 'Quirky',
        increase: '',
        inc_short: '',
        decrease: '',
        dec_short: '',
    },
    {
        name: 'Rash',
        increase: 'special-attack',
        inc_short: 'spa',
        decrease: 'special-defense',
        dec_short: 'spd',
    },
    {
        name: 'Relaxed',
        increase: 'defense',
        inc_short: 'def',
        decrease: 'speed',
        dec_short: 'spe',
    },
    {
        name: 'Sassy',
        increase: 'special-defense',
        inc_short: 'spd',
        decrease: 'speed',
        dec_short: 'spe',
    },
    {
        name: 'Serious',
        increase: '',
        inc_short: '',
        decrease: '',
        dec_short: '',
    },
    {
        name: 'Timid',
        increase: 'speed',
        inc_short: 'spe',
        decrease: 'attack',
        dec_short: 'atk',
    }
];

export default POKEMON_NATURES;