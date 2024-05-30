import type { Page } from "@sveltejs/kit";

export const navigatePokemon = (id: number | string, page: Page<Record<string, string>, string | null>, suggestedRoute: string | null = null) => {
    if (!page.route.id) return "";

    const [_ = "", group = "", route = "", currentId = "", section = ""] = page.route.id.split('/');

    return `/${suggestedRoute ?? route}/${id}/${section}`;
};