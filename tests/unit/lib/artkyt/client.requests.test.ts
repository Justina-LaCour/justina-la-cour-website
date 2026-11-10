import { ArtkytClient } from "$lib/artkyt/client";
import {
    API_BASE_URL,
    PAGINATION,
    createClient,
    createFetchMock,
    createUnexpectedFetchMock,
    jsonResponse,
    paginatedResponse,
    requestUrl
} from "$tests/support/artkyt";
import { describe, expect, it, vi } from "vitest";

interface RequestCase {
    name: string;
    invoke(client: ArtkytClient): Promise<unknown>;
    response(): Response;
    pathname: string;
    search: Record<string, string | null>;
}

interface ListCase {
    name: string;
    wireKey: string;
    invoke(client: ArtkytClient): Promise<unknown>;
}

const fromDate = new Date("2026-01-02T03:04:05.000Z");
const toDate = new Date("2026-12-30T20:15:00.000Z");

const requestCases: RequestCase[] = [
    {
        name: "news list without a content length override",
        invoke: (client) => client.getNewsList({ lang: "en" }),
        response: () => paginatedResponse("news", []),
        pathname: "/api/public/profile/profile-id/news",
        search: { lang: "en", page: "0", pageSize: "10", maxContentLength: null }
    },
    {
        name: "news list with longer previews",
        invoke: (client) => client.getNewsList({
            lang: "en",
            pagination: { page: 1, pageSize: 10 },
            maxContentLength: 200
        }),
        response: () => paginatedResponse("news", []),
        pathname: "/api/public/profile/profile-id/news",
        search: { lang: "en", page: "1", pageSize: "10", maxContentLength: "200" }
    },
    {
        name: "news in HTML format",
        invoke: (client) => client.getNews({ id: "news/id", lang: "fr", format: "html" }),
        response: () => jsonResponse({ news: {} }),
        pathname: "/api/public/profile/profile-id/news/news%2Fid",
        search: { lang: "fr", format: "html" }
    },
    {
        name: "news without a format override",
        invoke: (client) => client.getNews({ id: "news/id", lang: "en" }),
        response: () => jsonResponse({ news: {} }),
        pathname: "/api/public/profile/profile-id/news/news%2Fid",
        search: { lang: "en" }
    },
    {
        name: "artist",
        invoke: (client) => client.getArtist({
            id: "artist/id",
            lang: "fr",
            format: "html"
        }),
        response: () => jsonResponse({ artist: {} }),
        pathname: "/api/public/profile/profile-id/artists/artist%2Fid",
        search: { lang: "fr", format: "html" }
    },
    {
        name: "artist list",
        invoke: (client) => client.getArtistsList({
            lang: "fr",
            filter: {
                tags: [{ name: "2027" }],
                maxContentLength: 560
            },
            pagination: { page: 1, pageSize: 30 }
        }),
        response: () => paginatedResponse("artists", []),
        pathname: "/api/public/profile/profile-id/artists",
        search: {
            lang: "fr",
            tags: "2027",
            maxContentLength: "560",
            page: "1",
            pageSize: "30"
        }
    },
    {
        name: "profile links",
        invoke: (client) => client.getProfileLinks({
            platforms: ["instagram", "youtube"],
            pagination: { page: 2, pageSize: 25 }
        }),
        response: () => paginatedResponse("links", []),
        pathname: "/api/public/profile/profile-id/links",
        search: {
            platforms: "instagram;youtube",
            page: "2",
            pageSize: "25"
        }
    },
    {
        name: "biography",
        invoke: (client) => client.getBio({
            id: "bio/id",
            lang: "fr",
            format: "html"
        }),
        response: () => jsonResponse({ bio: {} }),
        pathname: "/api/public/profile/profile-id/bios/bio%2Fid",
        search: { lang: "fr", format: "html" }
    },
    {
        name: "concert list",
        invoke: (client) => client.getConcertsList({
            lang: "de",
            filter: {
                ids: ["one", "two"],
                tags: [
                    { name: "edition", value: "2026" },
                    { name: "featured" }
                ],
                getPerformances: "as-separate-concerts",
                includeCancelled: false,
                includeFull: true,
                fromDate,
                toDate,
                sort: "startDateDesc"
            },
            pagination: { page: 3, pageSize: 40 }
        }),
        response: () => paginatedResponse("concerts", []),
        pathname: "/api/public/profile/profile-id/concerts",
        search: {
            lang: "de",
            ids: "one;two",
            tags: "edition:2026;featured",
            getPerformances: "as-separate-concerts",
            includeCancelled: "false",
            includeFull: "true",
            from: fromDate.toISOString(),
            to: toDate.toISOString(),
            sort: "startDateDesc",
            page: "3",
            pageSize: "40"
        }
    },
    {
        name: "gallery list",
        invoke: (client) => client.getGalleriesList({
            lang: "en",
            filter: { tags: [{ name: "press", value: "yes" }] },
            pagination: { pageSize: 12 }
        }),
        response: () => paginatedResponse("galleries", []),
        pathname: "/api/public/profile/profile-id/galleries",
        search: {
            lang: "en",
            tags: "press:yes",
            page: "0",
            pageSize: "12"
        }
    },
    {
        name: "repertoire list",
        invoke: (client) => client.getRepertoireList({
            lang: "fr",
            filter: {
                format: "json",
                tags: [{ name: "season", value: "2026" }]
            },
            pagination: { page: 1, pageSize: 50 }
        }),
        response: () => paginatedResponse("repertoirePrograms", []),
        pathname: "/api/public/profile/profile-id/repertoire",
        search: {
            lang: "fr",
            format: "json",
            tags: "season:2026",
            page: "1",
            pageSize: "50"
        }
    }
];

const listCases: ListCase[] = [
    {
        name: "artists",
        wireKey: "artists",
        invoke: (client) => client.getArtistsList({ lang: "en" })
    },
    {
        name: "profile links",
        wireKey: "links",
        invoke: (client) => client.getProfileLinks()
    },
    {
        name: "news",
        wireKey: "news",
        invoke: (client) => client.getNewsList({ lang: "en" })
    },
    {
        name: "concerts",
        wireKey: "concerts",
        invoke: (client) => client.getConcertsList({ lang: "en" })
    },
    {
        name: "compositions",
        wireKey: "compositions",
        invoke: (client) => client.getCompositionsList({ lang: "en" })
    },
    {
        name: "galleries",
        wireKey: "galleries",
        invoke: (client) => client.getGalleriesList({ lang: "en" })
    },
    {
        name: "recordings",
        wireKey: "recordings",
        invoke: (client) => client.getRecordingsList({ lang: "en" })
    },
    {
        name: "repertoire",
        wireKey: "repertoirePrograms",
        invoke: (client) => client.getRepertoireList({ lang: "en" })
    }
];

describe("ArtkytClient configuration", () => {
    it("rejects invalid constructor values", () => {
        expect(() => new ArtkytClient({ profileId: " " })).toThrow(
            "profileId must not be empty"
        );
        expect(
            () => new ArtkytClient({ profileId: "profile", defaultTtlMs: -1 })
        ).toThrow("defaultTtlMs must be a non-negative number");
        expect(
            () => new ArtkytClient({ profileId: "profile", defaultTimeoutMs: 0 })
        ).toThrow("defaultTimeoutMs must be a positive integer");
        expect(
            () => new ArtkytClient({ profileId: "profile", maxCacheEntries: 0 })
        ).toThrow("maxCacheEntries must be a positive integer");
    });

    it("returns a configuration failure for website-bound mutations", async () => {
        const fetchMock = createUnexpectedFetchMock();
        const client = createClient(fetchMock, { websiteId: undefined });

        const contact = await client.postContactMessage({ content: "Hello" });
        const newsletter = await client.subscribeToNewsletter({
            newsletterId: "newsletter-id",
            subscription: { subscriberEmail: "person@example.com" }
        });

        expect(contact).toMatchObject({
            success: false,
            error: { code: "configuration" }
        });
        expect(newsletter).toMatchObject({
            success: false,
            error: { code: "configuration" }
        });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("rejects an invalid per-request cache TTL without fetching", async () => {
        const fetchMock = createUnexpectedFetchMock();
        const client = createClient(fetchMock);

        const result = await client.getNewsList(
            { lang: "en" },
            { cache: { ttlMs: -1 } }
        );

        expect(result).toMatchObject({
            success: false,
            error: { code: "configuration" }
        });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it.each([
        Number.POSITIVE_INFINITY,
        1.5,
        2 ** 31
    ])("rejects invalid per-request timeout %s without fetching", async (timeoutMs) => {
        const fetchMock = createUnexpectedFetchMock();
        const client = createClient(fetchMock);

        const result = await client.getNewsList(
            { lang: "en" },
            { timeoutMs }
        );

        expect(result).toMatchObject({
            success: false,
            error: { code: "configuration" }
        });
        expect(fetchMock).not.toHaveBeenCalled();
    });
});

describe("ArtkytClient request serialization", () => {
    it.each(requestCases)("serializes $name requests", async (testCase) => {
        const fetchMock = createFetchMock(async () => testCase.response());
        const client = createClient(fetchMock);

        await testCase.invoke(client);

        expect(fetchMock).toHaveBeenCalledOnce();
        const url = requestUrl(fetchMock);
        expect(url.pathname).toBe(testCase.pathname);
        for (const [key, value] of Object.entries(testCase.search)) {
            expect(url.searchParams.get(key), key).toBe(value);
        }
    });

    it.each(listCases)("normalizes $name list responses", async (testCase) => {
        const fetchMock = createFetchMock(async () =>
            paginatedResponse(testCase.wireKey, [testCase.wireKey])
        );
        const client = createClient(fetchMock);

        const result = await testCase.invoke(client);

        expect(result).toEqual({
            success: true,
            value: {
                items: [testCase.wireKey],
                pagination: PAGINATION
            }
        });
    });

    it("prefers a per-request fetch implementation", async () => {
        const configuredFetch = createFetchMock(async () =>
            paginatedResponse("news", [{ source: "configured" }])
        );
        const requestFetch = createFetchMock(async () =>
            paginatedResponse("news", [{ source: "request" }])
        );
        const client = createClient(configuredFetch);

        const result = await client.getNewsList(
            { lang: "en" },
            { fetch: requestFetch }
        );

        expect(result).toEqual({
            success: true,
            value: {
                items: [{ source: "request" }],
                pagination: PAGINATION
            }
        });
        expect(requestFetch).toHaveBeenCalledOnce();
        expect(configuredFetch).not.toHaveBeenCalled();
    });

    it("falls back to the global fetch implementation", async () => {
        const globalFetch = createFetchMock(async () =>
            paginatedResponse("news", [{ source: "global" }])
        );
        vi.stubGlobal("fetch", globalFetch);
        const client = new ArtkytClient({
            profileId: "profile-id",
            baseUrl: API_BASE_URL
        });

        const result = await client.getNewsList({ lang: "en" });

        expect(result).toEqual({
            success: true,
            value: {
                items: [{ source: "global" }],
                pagination: PAGINATION
            }
        });
        expect(globalFetch).toHaveBeenCalledOnce();
    });

    it("resolves request timeout before constructor and built-in defaults", async () => {
        const timeoutSpy = vi.spyOn(AbortSignal, "timeout");
        const fetchMock = createFetchMock(async () =>
            jsonResponse({ news: {} })
        );
        const client = createClient(fetchMock, { defaultTimeoutMs: 4_000 });

        await client.getNews({ id: "request", lang: "en" }, { timeoutMs: 250 });
        await client.getNews({ id: "constructor", lang: "en" });
        await createClient(fetchMock).getNews({ id: "built-in", lang: "en" });

        expect(timeoutSpy).toHaveBeenNthCalledWith(1, 250);
        expect(timeoutSpy).toHaveBeenNthCalledWith(2, 4_000);
        expect(timeoutSpy).toHaveBeenNthCalledWith(3, 10_000);
    });

    it("combines caller cancellation with the request timeout", async () => {
        const controller = new AbortController();
        let requestSignal: AbortSignal | null | undefined;
        const fetchMock = createFetchMock(async (_input, init) => {
            requestSignal = init?.signal;

            return new Promise<Response>((_resolve, reject) => {
                requestSignal?.addEventListener(
                    "abort",
                    () => reject(new DOMException("Aborted", "AbortError")),
                    { once: true }
                );
            });
        });
        const client = createClient(fetchMock);

        const pending = client.getNewsList(
            { lang: "en" },
            { signal: controller.signal }
        );
        controller.abort();

        await expect(pending).resolves.toEqual({
            success: false,
            error: {
                code: "network",
                message: "Unable to reach the Artkyt API"
            }
        });
        expect(requestSignal).toBeInstanceOf(AbortSignal);
        expect(requestSignal).not.toBe(controller.signal);
        expect(requestSignal?.aborted).toBe(true);
    });
});
