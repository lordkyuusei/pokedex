import { writable, type Writable } from "svelte/store";

const lang: Writable<Lang> = writable('en');

export { lang };