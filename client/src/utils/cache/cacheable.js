//https://hilla.dev/docs/react/guides/client-caching, https://hilla.dev

export default async (fn, key, defaultValue) => {
    let result;
    try {
        // retrieve the data from backend.
        result = await fn();
        // save the data to localStorage.
        localStorage.setItem(key, JSON.stringify(result));
    } catch {
        // if failed to retrieve the data from backend, try localStorage.
        const cached = localStorage.getItem(key);
        // use the cached data if available, otherwise the default value.
        result = cached ? JSON.parse(cached) : defaultValue;
    }
    return result;
}