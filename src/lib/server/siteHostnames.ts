export function parseSiteHostnames(value: string): ReadonlySet<string> {
    const hostnames = value
        .split(",")
        .map((hostname) => hostname.trim().toLowerCase())
        .filter(Boolean);

    if (hostnames.some((hostname) => !isBareHostname(hostname))) {
        return new Set();
    }

    return new Set(hostnames);
}

function isBareHostname(value: string): boolean {
    if (value.includes("*")) return false;

    try {
        const url = new URL(`https://${value}`);
        return (
            url.hostname === value &&
            !url.port &&
            url.pathname === "/" &&
            !url.search &&
            !url.hash
        );
    } catch {
        return false;
    }
}
