export const isStorageFull = (size: number): boolean => {
    const testString = 'a'.repeat(size);
    try {
        localStorage.setItem('__storage_test__', testString);
        localStorage.removeItem('__storage_test__');
        return false;
    }
    catch (e) {
        return e instanceof DOMException && (
            localStorage.length !== 0 &&
            [22, 1014].includes(e.code) ||
            ["QuotaExceededError", "NS_ERROR_DOM_QUOTA_REACHED"].includes(e.name));
    }
}

// remove items from localStorage until it lost the specified size
export const freeStorage = (size: number) => {
    const keys = Object.keys(localStorage);
    let totalSize = 0;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = localStorage.getItem(key);
        if (value) {
            totalSize += value.length;
            if (totalSize > size) {
                localStorage.removeItem(key);
                totalSize -= value.length;
            }
        }
    }
}
