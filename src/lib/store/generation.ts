import type { Generation } from "$lib/types/generation";
import { writable } from "svelte/store";

const generation = writable<Generation>();
const version = writable<string>()

export { generation, version };