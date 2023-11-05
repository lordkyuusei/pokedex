import type { Page } from "@sveltejs/kit";

export const navigatePokemon = (id: number | string, page: Page<Record<string, string>, string | null>) => {
    if (!page.route.id) return "";

    const [_ = "", group = "", path = "", currentId = "", section = ""] = page.route.id.split('/');

    return `/${path}/${id}/${section}`;
};