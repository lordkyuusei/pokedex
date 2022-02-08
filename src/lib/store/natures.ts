export type PokemonNatureLight = {
    name: string;
    increase: string;
    decrease: string;
    inc_short: string;
    dec_short: string;
};

const POKEMON_NATURES: PokemonNatureLight[] = [
    // get all natures with increasing and decreasing stats
    {
        name: 'adamant',
        increase: 'attack',
        inc_short: 'atk',
        decrease: 'special-attack',
        dec_short: 'spa',
    },
    {
        name: 'bashful',
        increase: '',
        inc_short: '',
        decrease: '',
        dec_short: '',
    },
    {
        name: 'bold',
        increase: 'defense',
        inc_short: 'def',
        decrease: 'attack',
        dec_short: 'atk',
    },
    {
        name: 'brave',
        increase: 'attack',
        inc_short: 'atk',
        decrease: 'speed',
        dec_short: 'spe',
    },
    {
        name: 'calm',
        increase: 'special-defense',
        inc_short: 'spd',
        decrease: 'attack',
        dec_short: 'atk',
    },
    {
        name: 'careful',
        increase: 'special-defense',
        inc_short: 'spd',
        decrease: 'special-attack',
        dec_short: 'spa',
    },
    {
        name: 'docile',
        increase: '',
        inc_short: '',
        decrease: '',
        dec_short: '',
    },
    {
        name: 'gentle',
        increase: 'special-defense',
        inc_short: 'spd',
        decrease: 'defense',
        dec_short: 'def',
    },
    {
        name: 'hardy',
        increase: '',
        inc_short: '',
        decrease: '',
        dec_short: '',
    },
    {
        name: 'hasty',
        increase: 'speed',
        inc_short: 'spe',
        decrease: 'defense',
        dec_short: 'def',
    },
    {
        name: 'impish',
        increase: 'defense',
        inc_short: 'def',
        decrease: 'special-attack',
        dec_short: 'spa',
    },
    {
        name: 'jolly',
        increase: 'speed',
        inc_short: 'spe',
        decrease: 'special-attack',
        dec_short: 'spa',
    },
    {
        name: 'lax',
        increase: 'defense',
        inc_short: 'def',
        decrease: 'special-defense',
        dec_short: 'spd',
    },
    {
        name: 'lonely',
        increase: 'attack',
        inc_short: 'atk',
        decrease: 'defense',
        dec_short: 'def',
    },
    {
        name: 'mild',
        increase: 'special-attack',
        inc_short: 'spa',
        decrease: 'defense',
        dec_short: 'def',
    },
    {
        name: 'modest',
        increase: 'special-attack',
        inc_short: 'spa',
        decrease: 'attack',
        dec_short: 'atk',
    },
    {
        name: 'naive',
        increase: 'speed',
        inc_short: 'spe',
        decrease: 'special-defense',
        dec_short: 'spd',
    },
    {
        name: 'naughty',
        increase: 'attack',
        inc_short: 'atk',
        decrease: 'special-defense',
        dec_short: 'spd',
    },
    {
        name: 'quiet',
        increase: 'special-attack',
        inc_short: 'spa',
        decrease: 'speed',
        dec_short: 'spe',
    },
    {
        name: 'quirky',
        increase: '',
        inc_short: '',
        decrease: '',
        dec_short: '',
    },
    {
        name: 'rash',
        increase: 'special-attack',
        inc_short: 'spa',
        decrease: 'special-defense',
        dec_short: 'spd',
    },
    {
        name: 'relaxed',
        increase: 'defense',
        inc_short: 'def',
        decrease: 'speed',
        dec_short: 'spe',
    },
    {
        name: 'sassy',
        increase: 'special-defense',
        inc_short: 'spd',
        decrease: 'speed',
        dec_short: 'spe',
    },
    {
        name: 'serious',
        increase: '',
        inc_short: '',
        decrease: '',
        dec_short: '',
    },
    {
        name: 'timid',
        increase: 'speed',
        inc_short: 'spe',
        decrease: 'attack',
        dec_short: 'atk',
    }
].sort((a, b) => a.inc_short.localeCompare(b.inc_short));

export default POKEMON_NATURES;