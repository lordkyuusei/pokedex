import { writable, type Writable } from "svelte/store";

type SaveStatus = {
    status: string;
    isSuccess: boolean;
}

export const saveStatus: Writable<SaveStatus> = writable({ status: 'Save', isSuccess: true });