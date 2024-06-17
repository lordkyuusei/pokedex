import { writable, type Writable } from "svelte/store";

const theme: Writable<Theme> = writable();
const variant: Writable<Variant<Theme>> = writable();

export { theme, variant };