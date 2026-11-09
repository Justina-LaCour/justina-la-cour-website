import {
    PAGINATION,
    createClient,
    createFetchMock,
    jsonResponse,
    paginatedResponse
} from "$tests/support/artkyt";
import { describe, expect, it, vi } from "vitest";

describe("ArtkytClient caching", () => {
    it("shares identical GET requests while they are in flight", async () => {
        let resolveRequest: ((response: Response) => void) | undefined;
        const fetchMock = createFetchMock(() =>
            new Promise<Response>((resolve) => {
                resolveRequest = resolve;
            })
        );
        const client = createClient(fetchMock);

        const first = client.getNewsList({ lang: "en" });
        const second = client.getNewsList({ lang: "en" });

        expect(fetchMock).toHaveBeenCalledOnce();
        resolveRequest?.(paginatedResponse("news", [{ shared: true }]));

        await expect(Promise.all([first, second])).resolves.toEqual([
            {
                success: true,
                value: {
                    items: [{ shared: true }],
                    pagination: PAGINATION
                }
            },
            {
                success: true,
                value: {
                    items: [{ shared: true }],
                    pagination: PAGINATION
                }
            }
        ]);
    });

    it("shares an in-flight failure but retries a later request", async () => {
        let resolveRetry: ((response: Response) => void) | undefined;
        const fetchMock = createFetchMock(() =>
            new Promise<Response>((resolve) => {
                resolveRetry = resolve;
            })
        ).mockResolvedValueOnce(new Response("Unavailable", { status: 503 }));
        const client = createClient(fetchMock);

        const first = client.getNewsList({ lang: "en" });
        const second = client.getNewsList({ lang: "en" });

        const failures = await Promise.all([first, second]);
        expect(failures).toEqual([
            expect.objectContaining({
                success: false,
                error: expect.objectContaining({ code: "http_503" })
            }),
            expect.objectContaining({
                success: false,
                error: expect.objectContaining({ code: "http_503" })
            })
        ]);
        expect(fetchMock).toHaveBeenCalledOnce();

        const retry = client.getNewsList({ lang: "en" });
        resolveRetry?.(paginatedResponse("news", [{ recovered: true }]));

        await expect(retry).resolves.toMatchObject({
            success: true,
            value: { items: [{ recovered: true }] }
        });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("does not coalesce a bypass request with a pending GET", async () => {
        let resolvePending: ((response: Response) => void) | undefined;
        let requestCount = 0;
        const fetchMock = createFetchMock(() => {
            requestCount += 1;

            if (requestCount === 1) {
                return new Promise<Response>((resolve) => {
                    resolvePending = resolve;
                });
            }

            return Promise.resolve(
                paginatedResponse("news", [{ refreshed: true }])
            );
        });
        const client = createClient(fetchMock);

        const pending = client.getNewsList({ lang: "en" });
        const bypassed = client.getNewsList(
            { lang: "en" },
            { cache: { mode: "bypass" } }
        );

        expect(fetchMock).toHaveBeenCalledTimes(2);
        await expect(bypassed).resolves.toMatchObject({
            success: true,
            value: { items: [{ refreshed: true }] }
        });

        resolvePending?.(paginatedResponse("news", [{ pending: true }]));
        await pending;

        await expect(client.getNewsList({ lang: "en" })).resolves.toMatchObject({
            success: true,
            value: { items: [{ refreshed: true }] }
        });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("keeps caller-controlled cancellation independent", async () => {
        const fetchMock = createFetchMock(() =>
            Promise.resolve(paginatedResponse("news", []))
        );
        const client = createClient(fetchMock);

        await Promise.all([
            client.getNewsList(
                { lang: "en" },
                { signal: new AbortController().signal }
            ),
            client.getNewsList(
                { lang: "en" },
                { signal: new AbortController().signal }
            )
        ]);

        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("uses cached GET results and supports explicit clearing", async () => {
        const fetchMock = createFetchMock(async () =>
            paginatedResponse("news", [])
        );
        const client = createClient(fetchMock);

        await client.getNewsList({ lang: "en" });
        await client.getNewsList({ lang: "en" });
        expect(fetchMock).toHaveBeenCalledOnce();

        client.clearCache();
        await client.getNewsList({ lang: "en" });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("expires cached results using the requested TTL", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
        const fetchMock = createFetchMock(async () =>
            paginatedResponse("news", [])
        );
        const client = createClient(fetchMock);

        await client.getNewsList(
            { lang: "en" },
            { cache: { ttlMs: 100 } }
        );
        vi.advanceTimersByTime(99);
        await client.getNewsList(
            { lang: "en" },
            { cache: { ttlMs: 100 } }
        );
        expect(fetchMock).toHaveBeenCalledOnce();

        vi.advanceTimersByTime(1);
        await client.getNewsList(
            { lang: "en" },
            { cache: { ttlMs: 100 } }
        );
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("bypasses cache reads and refreshes the stored value", async () => {
        let value = 0;
        const fetchMock = createFetchMock(async () =>
            paginatedResponse("news", [{ value: ++value }])
        );
        const client = createClient(fetchMock);

        const first = await client.getNewsList({ lang: "en" });
        const refreshed = await client.getNewsList(
            { lang: "en" },
            { cache: { mode: "bypass" } }
        );
        const cached = await client.getNewsList({ lang: "en" });

        expect(first).toEqual({
            success: true,
            value: {
                items: [{ value: 1 }],
                pagination: PAGINATION
            }
        });
        expect(refreshed).toEqual({
            success: true,
            value: {
                items: [{ value: 2 }],
                pagination: PAGINATION
            }
        });
        expect(cached).toEqual(refreshed);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("evicts the least recently used entry", async () => {
        const fetchMock = createFetchMock(async () =>
            jsonResponse({ news: {} })
        );
        const client = createClient(fetchMock, { maxCacheEntries: 2 });

        await client.getNews({ id: "a", lang: "en" });
        await client.getNews({ id: "b", lang: "en" });
        await client.getNews({ id: "a", lang: "en" });
        await client.getNews({ id: "c", lang: "en" });
        await client.getNews({ id: "b", lang: "en" });

        expect(fetchMock).toHaveBeenCalledTimes(4);
    });

    it("does not cache failed requests", async () => {
        const fetchMock = createFetchMock(async () =>
            paginatedResponse("news", [{ recovered: true }])
        )
            .mockResolvedValueOnce(new Response("Unavailable", { status: 503 }));
        const client = createClient(fetchMock);

        const failed = await client.getNewsList({ lang: "en" });
        const recovered = await client.getNewsList({ lang: "en" });

        expect(failed).toMatchObject({
            success: false,
            error: { code: "http_503", status: 503 }
        });
        expect(recovered).toEqual({
            success: true,
            value: {
                items: [{ recovered: true }],
                pagination: PAGINATION
            }
        });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("does not cache timed-out requests", async () => {
        let requestCount = 0;
        const fetchMock = createFetchMock(async (_input, init) => {
            requestCount += 1;

            if (requestCount === 1) {
                return new Promise<Response>((_resolve, reject) => {
                    init?.signal?.addEventListener(
                        "abort",
                        () => reject(new DOMException("Timed out", "TimeoutError")),
                        { once: true }
                    );
                });
            }

            return paginatedResponse("news", [{ recovered: true }]);
        });
        const client = createClient(fetchMock);

        const timedOut = await client.getNewsList(
            { lang: "en" },
            { timeoutMs: 1 }
        );
        const recovered = await client.getNewsList({ lang: "en" });

        expect(timedOut).toMatchObject({
            success: false,
            error: { code: "network" }
        });
        expect(recovered).toEqual({
            success: true,
            value: {
                items: [{ recovered: true }],
                pagination: PAGINATION
            }
        });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
});
