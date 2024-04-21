import { derived, writable, type Readable } from "svelte/store";

export type Device = 'desktop' | 'tablet' | 'mobile' | 'none';
export const MOBILE_THRESHOLD = 640;
export const TABLET_THRESHOLD = 1024;

export const deviceWidth = writable(-1);

export const device: Readable<Device> = derived(deviceWidth, (width) =>
    width === -1 ? 'none' :
        width > TABLET_THRESHOLD ? 'desktop' :
            width > MOBILE_THRESHOLD ? 'tablet' : 'mobile');

export const isRendered: Readable<boolean> = derived(deviceWidth, (width) => width !== -1);
export const isMobile: Readable<boolean> = derived(device, (device) => device === 'mobile');