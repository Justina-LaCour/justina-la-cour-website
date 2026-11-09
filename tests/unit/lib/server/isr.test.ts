import { triggerRevalidation } from "$lib/server/isr";
import { describe, expect, it, vi } from "vitest";

describe("triggerRevalidation", () => {
    it("starts the next request as soon as a concurrency slot is free", async () => {
        vi.spyOn(console, "log").mockImplementation(() => {});
        const requests = new Map<string, (response: Response) => void>();
        const fetcher = vi.fn((input: RequestInfo | URL) => {
            const path = new URL(String(input)).pathname;

            return new Promise<Response>((resolve) => {
                requests.set(path, resolve);
            });
        });

        const pending = triggerRevalidation(
            "https://example.com",
            ["/first", "/second", "/third"],
            "private-token",
            { fetcher, maxConcurrency: 2 }
        );

        expect(fetcher).toHaveBeenCalledTimes(2);
        requests.get("/second")?.(new Response(null, { status: 204 }));
        await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(3));

        requests.get("/first")?.(new Response(null, { status: 204 }));
        requests.get("/third")?.(new Response(null, { status: 204 }));

        await expect(pending).resolves.toEqual({
            revalidated: ["/first", "/second", "/third"],
            failed: []
        });
    });

    it.each([
        { maxConcurrency: 1, expectedInitialRequests: 1 },
        { maxConcurrency: 4, expectedInitialRequests: 3 }
    ])(
        "supports a concurrency limit of $maxConcurrency",
        async ({ maxConcurrency, expectedInitialRequests }) => {
            vi.spyOn(console, "log").mockImplementation(() => {});
            const resolvers: Array<(response: Response) => void> = [];
            const fetcher = vi.fn(() =>
                new Promise<Response>((resolve) => {
                    resolvers.push(resolve);
                })
            );
            const pending = triggerRevalidation(
                "https://example.com",
                ["/first", "/second", "/third"],
                "private-token",
                { fetcher, maxConcurrency }
            );

            expect(fetcher).toHaveBeenCalledTimes(expectedInitialRequests);

            while (resolvers.length > 0) {
                resolvers.shift()?.(new Response(null, { status: 204 }));
                await vi.waitFor(() => {
                    const allRequestsStarted = fetcher.mock.calls.length === 3;
                    const workerCanAdvance = resolvers.length > 0;
                    expect(allRequestsStarted || workerCanAdvance).toBe(true);
                });
            }

            await expect(pending).resolves.toEqual({
                revalidated: ["/first", "/second", "/third"],
                failed: []
            });
        }
    );

    it.each([0, -1, 1.5, Number.POSITIVE_INFINITY, Number.NaN])(
        "rejects an invalid concurrency limit of %s",
        async (maxConcurrency) => {
            await expect(triggerRevalidation(
                "https://example.com",
                [],
                "private-token",
                { fetcher: vi.fn(), maxConcurrency }
            )).rejects.toThrow(
                new TypeError("maxConcurrency must be a positive integer")
            );
        }
    );

    it("sends bounded HEAD requests and preserves the existing result", async () => {
        vi.spyOn(console, "log").mockImplementation(() => {});
        const timeout = vi.spyOn(AbortSignal, "timeout");
        const fetcher = vi.fn(async (input: RequestInfo | URL, _init?: RequestInit) => {
            const path = new URL(String(input)).pathname;

            if (path === "/en/error") throw new Error("network failure");
            return new Response(null, {
                status: path === "/en/missing" ? 404 : 204
            });
        });

        const result = await triggerRevalidation(
            "https://example.com",
            ["/en/bio", "/en/missing", "/en/error"],
            "private-token",
            { fetcher }
        );

        expect(result).toEqual({
            revalidated: ["/en/bio"],
            failed: [
                { path: "/en/missing", status: 404 },
                { path: "/en/error", status: null }
            ]
        });
        expect(timeout).toHaveBeenCalledTimes(3);
        expect(timeout).toHaveBeenCalledWith(30_000);
        expect(fetcher.mock.calls[0][1]).toMatchObject({
            method: "HEAD",
            redirect: "manual",
            headers: {
                "x-prerender-revalidate": "private-token"
            }
        });
        expect(fetcher.mock.calls[0][1]?.signal).toBeInstanceOf(AbortSignal);
    });

    it("maps a timed-out request to a failed path without a status", async () => {
        vi.spyOn(console, "log").mockImplementation(() => {});
        const timeout = new AbortController();
        vi.spyOn(AbortSignal, "timeout").mockReturnValue(timeout.signal);
        const fetcher = vi.fn((_input: RequestInfo | URL, init?: RequestInit) =>
            new Promise<Response>((_resolve, reject) => {
                init?.signal?.addEventListener("abort", () => {
                    reject(new DOMException("Timed out", "TimeoutError"));
                });
            })
        );

        const pending = triggerRevalidation(
            "https://example.com",
            ["/en/bio"],
            "private-token",
            { fetcher }
        );
        timeout.abort(new DOMException("Timed out", "TimeoutError"));

        await expect(pending).resolves.toEqual({
            revalidated: [],
            failed: [{ path: "/en/bio", status: null }]
        });
    });
});
