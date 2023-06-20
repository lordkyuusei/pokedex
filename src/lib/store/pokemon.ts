import type { PokemonSpecie } from "$lib/types/pokeapi/specie";
import { writable, type Writable } from "svelte/store";

const pokemon: Writable<PokemonSpecie> = writable();

export default pokemon;