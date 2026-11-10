import { pathToFileURL } from "node:url";

/**
 * @typedef {{ revalidated: string[], failed: { path: string, status: number | null }[] }} RevalidationResult
 */

/** @param {unknown} value @returns {value is RevalidationResult} */
function isRevalidationResult(value) {
    if (!value || typeof value !== "object") return false;
    const result = /** @type {RevalidationResult} */ (value);
    return Array.isArray(result.revalidated)
        && result.revalidated.every((path) => typeof path === "string" && path.startsWith("/"))
        && Array.isArray(result.failed)
        && result.failed.every((failure) => failure && typeof failure.path === "string"
            && failure.path.startsWith("/")
            && (failure.status === null || (Number.isInteger(failure.status)
                && failure.status >= 100 && failure.status <= 599)));
}

/**
 * @param {{ siteUrl: string, secret: string }} config
 * @param {typeof fetch} [fetcher]
 * @returns {Promise<RevalidationResult & { httpStatus: number }>}
 */
export async function revalidateSite({ siteUrl, secret }, fetcher = fetch) {
    let url;
    try {
        url = new URL(siteUrl.trim());
    } catch {
        throw new Error("Set PUBLIC_SITE_URL to the deployment's HTTPS origin in .env.");
    }
    if (url.protocol !== "https:" || url.username || url.password
        || url.pathname !== "/" || url.search || url.hash) {
        throw new Error("PUBLIC_SITE_URL must be an HTTPS origin without credentials, a path, query or fragment.");
    }
    if (!secret.trim()) throw new Error("Set ARTKYT_WEBHOOK_SECRET in .env to the deployed webhook secret.");

    let response;
    try {
        response = await fetcher(new URL("/api/revalidate", url), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${secret.trim()}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pages: "all" }),
            redirect: "error",
            signal: AbortSignal.timeout(180_000)
        });
    } catch {
        // Never echo a fetch exception: it may include request credentials.
        throw new Error("Revalidation request failed or timed out. Check the deployment URL and connectivity.");
    }

    let result;
    try {
        result = await response.json();
    } catch {
        throw new Error(`Revalidation returned HTTP ${response.status} with an invalid JSON response.`);
    }
    if (!isRevalidationResult(result)) {
        throw new Error(`Revalidation returned HTTP ${response.status} without a valid result. Check deployment configuration and authentication.`);
    }
    return { ...result, httpStatus: response.status };
}

/**
 * @param {Record<string, string | undefined>} env
 * @param {{ fetcher?: typeof fetch, log?: (message: string) => void, error?: (message: string) => void }} [options]
 * @returns {Promise<number>}
 */
export async function runRevalidation(env, { fetcher = fetch, log = console.log, error = console.error } = {}) {
    try {
        const result = await revalidateSite({
            siteUrl: env.PUBLIC_SITE_URL ?? "",
            secret: env.ARTKYT_WEBHOOK_SECRET ?? ""
        }, fetcher);
        for (const path of result.revalidated) log(`Revalidated ${path}`);
        for (const failure of result.failed) {
            error(`Failed ${failure.path} (${failure.status === null ? "network error" : `HTTP ${failure.status}`})`);
        }
        log(`${result.revalidated.length} revalidated; ${result.failed.length} failed.`);
        if (result.httpStatus < 200 || result.httpStatus >= 300) {
            error(`Revalidation endpoint returned HTTP ${result.httpStatus}.`);
            return 1;
        }
        if (result.failed.length || result.revalidated.length === 0) {
            if (!result.revalidated.length && !result.failed.length) error("No pages were revalidated. Check the server route map.");
            return 1;
        }
        return 0;
    } catch (cause) {
        error(cause instanceof Error ? cause.message : "Revalidation failed.");
        return 1;
    }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    process.exitCode = await runRevalidation(process.env);
}
