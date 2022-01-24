import { writable, derived } from "svelte/store";
import translations from "$lib/store/i18n/translations";

export const locale = writable("english");
export const locales = Object.keys(translations);

const translate = (locale: string, key: string | number, vars: { [x: string]: any; }) => {
    if (!key || !locale) {
        throw new Error("Missing translation key or variables");
    }

    let translation = translations[locale][key];

    if (!translation) {
        throw new Error(`Missing translation for key "${key}"`);
    }

    Object.keys(vars).map((key) => {
        const regex = new RegExp(`{{${key}}}`, "g");
        translation = translation.replace(regex, vars[key]);
    })

    return translation;
}

export const t = derived(locale, ($locale) => (key: string | number, vars = {}) => translate($locale, key, vars));