import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = (param) => {
    const isNumber = !isNaN(parseInt(param));
    const isOnlyString = param.match(/^[a-zA-Z]+$/g) !== null;
    return isNumber || isOnlyString;
}