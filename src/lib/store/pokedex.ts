import type { Lightkemon } from "$lib/types/Pokemon";
import { writable } from "svelte/store";

export const pokedex = writable<Lightkemon[]>([]);