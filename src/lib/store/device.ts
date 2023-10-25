import { derived, writable, type Readable } from "svelte/store";

export type Device = 'desktop' | 'tablet' | 'mobile';
export const MOBILE_THRESHOLD = 640;
export const TABLET_THRESHOLD = 1024;

export const deviceWidth = writable(0);

export const device: Readable<Device> = derived(deviceWidth, (width) =>
    width > TABLET_THRESHOLD ? 'desktop' :
        width > MOBILE_THRESHOLD ? 'tablet' : 'mobile');