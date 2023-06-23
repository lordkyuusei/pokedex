import { browser } from '$app/environment';
import { derived, writable } from "svelte/store";

export const deviceWidth = writable(0);

export const device = derived(deviceWidth, (width) =>
    width > 1024 ? 'desktop' :
        width > 414 ? 'tablet' : 'mobile');