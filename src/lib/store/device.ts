import { browser } from '$app/environment';
import { derived, writable } from "svelte/store";

export const deviceWidth = writable(0);
export const isMobile = writable(true);

export const device = derived([deviceWidth, isMobile], ([width, mobile]) =>
    width > 1024 || (!browser && !mobile) ? 'desktop' :
        width > 420 ? 'tablet' : 'mobile');