import { ISR_BYPASS_TOKEN } from "$app/env/private";
import type { Config } from "@sveltejs/adapter-vercel";

const HOUR_IN_SECONDS = 60 * 60;
const DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS;

export const ISR_CONFIG = {
    staticPage: {
        isr: {
            expiration: 7 * DAY_IN_SECONDS,
            bypassToken: ISR_BYPASS_TOKEN
        }
    },
    slowMoving: {
        isr: {
            expiration: 2 * DAY_IN_SECONDS,
            bypassToken: ISR_BYPASS_TOKEN
        }
    },
    concerts: {
        isr: {
            expiration: HOUR_IN_SECONDS,
            bypassToken: ISR_BYPASS_TOKEN
        }
    }
} as const satisfies Record<"staticPage" | "slowMoving" | "concerts", Config>;


export interface RevalidationResult {
    revalidated: string[];
    failed: Array<{
        path: string;
        status: number | null;
    }>;
}

export interface RevalidationOptions {
    fetcher?: typeof fetch;
    maxConcurrency?: number;
}

interface PathRevalidationResult {
    path: string;
    status: number | null;
    success: boolean;
}

export async function triggerRevalidation(
    origin: string | URL,
    paths: readonly string[],
    bypassToken: string,
    options: RevalidationOptions = {}
): Promise<RevalidationResult> {
    const {
        fetcher = fetch,
        maxConcurrency = 2
    } = options;

    if (!Number.isInteger(maxConcurrency) || maxConcurrency < 1) {
        throw new TypeError("maxConcurrency must be a positive integer");
    }

    const revalidatePath = async (
        path: string
    ): Promise<PathRevalidationResult> => {
        console.log(
            `Triggering revalidation for path: ${new URL(path, origin)}`
        );

        try {
            const response = await fetcher(new URL(path, origin), {
                method: "HEAD",
                redirect: "manual",
                signal: AbortSignal.timeout(30_000),
                headers: {
                    "x-prerender-revalidate": bypassToken
                }
            });

            return {
                path,
                status: response.status,
                success: response.ok
            };
        } catch {
            return {
                path,
                status: null,
                success: false
            };
        }
    };

    const results = new Array<PathRevalidationResult>(paths.length);
    let nextIndex = 0;

    async function worker(): Promise<void> {
        while (nextIndex < paths.length) {
            const index = nextIndex;
            nextIndex += 1;

            results[index] = await revalidatePath(paths[index]);
        }
    }

    await Promise.all(
        Array.from(
            { length: Math.min(maxConcurrency, paths.length) },
            () => worker()
        )
    );

    return {
        revalidated: results.filter((result) => result.success).map((result) => result.path),
        failed: results
            .filter((result) => !result.success)
            .map(({ path, status }) => ({ path, status }))
    };
}
