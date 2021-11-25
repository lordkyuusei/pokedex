import type { PokemonType } from "./types/PokemonType";

const POKEMON_TYPES: PokemonType[] = [
    {
        name: "normal",
        color: "rgb(255, 165, 159, 0.69)",
        icon: "🤘"
    },
    {
        name: "grass",
        color: "rgba(112, 158, 50, 0.69)",
        icon: "☘️"
    },
    {
        name: "poison",
        color: "rgb(123, 98, 172, 0.69)",
        icon: "🏴‍☠️"
    },
    {
        name: "fire",
        color: "rgb(201, 56, 56, 0.69)",
        icon: "🔥"
    },
    {
        name: "flying",
        color: "rgb(176, 199, 241, 0.69)",
        icon: "🕊️",
    }
];

export default POKEMON_TYPES;