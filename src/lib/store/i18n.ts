import { derived, type Readable } from "svelte/store";
import { lang } from "$lib/store/lang";

import i18nEn from "./i18n/en.json";
import i18nFr from "./i18n/fr.json";

const translations: Readable<{ [key: string]: string }> = derived(
    lang,
    $lang => $lang === "fr" ? i18nFr : i18nEn
);

export default derived(
    translations,
    $translations => (key: string) => $translations[key]
);