import React from "react";

//https://stackoverflow.com/a/57203332 from T.J. Crowder
export default (url, init, deps) => {
    // Allow the user to leave off `init` even if they include `deps`
    if (typeof deps == "undefined" && Array.isArray(init)) {
        deps = init;
        init = undefined;
    }
    if (!deps) {
        console.warn(
            "Using `useFetchJSON` with no dependencies array means you'll " +
                "re-fetch on EVERY render. You probably want an empty dependency " +
                "array instead."
        );
    }
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState(undefined);
    const [error, setError] = React.useState(undefined);
    

    React.useEffect(() => {
        setLoading(true);
        setData(undefined);
        setError(undefined);
        fetch(url, init)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                return response.json();
            })
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, deps);

    return [loading, data, error];
}