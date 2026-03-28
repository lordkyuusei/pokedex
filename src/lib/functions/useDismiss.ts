import { browser } from "$app/environment";
import type { Action } from "svelte/action";

const useDismiss: Action<HTMLElement, undefined, { ondismiss: (e: CustomEvent) => void }> = (node) => {
    const handleDismiss = (event: Event) => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(new CustomEvent('dismiss', node));
        }
    };

    if (browser) {
        document.addEventListener('click', handleDismiss, true);
    }

    return {
        destroy() {
            if (browser) {
                document.removeEventListener('click', handleDismiss, true);
            }
        }
    };
};

export default useDismiss;