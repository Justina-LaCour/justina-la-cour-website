const ALLOWED_PROTOCOLS: string[] = ["http:", "https:"] as const;

export function normalizeCanonicalUrl(value: string): string {
    const url = new URL(value.trim());

    if (
        url.protocol !== "https:" ||
        url.username ||
        url.password ||
        url.pathname !== "/" ||
        url.search ||
        url.hash
    ) {
        throw new TypeError("PUBLIC_SITE_URL must be an HTTPS origin");
    }

    return url.origin;
}

export function safeExternalHttpUrl(
    value: string | null | undefined
): URL | null {
    const href = value?.trim();
    if (!href) return null;

    try {
        const url = new URL(href);

        if (!ALLOWED_PROTOCOLS.includes(url.protocol) || url.username || url.password) {
            return null;
        }

        return url;
    } catch {
        return null;
    }
}

export function safeHttpHref(value: string | null | undefined): string | null {
    const href = value?.trim();
    if (!href) return null;

    if (href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/\\")) {
        return href;
    }

    return safeExternalHttpUrl(href) ? href : null;
}
