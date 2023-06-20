import { writable, type Writable } from "svelte/store";

const theme: Writable<Theme> = writable();

export { theme };