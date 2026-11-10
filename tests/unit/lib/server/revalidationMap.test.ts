import { RevalidationMap } from "$lib/server/revalidationMap";
import { describe, expect, it, vi } from "vitest";

type TestResource = "first" | "second";

describe("RevalidationMap", () => {
    it("localizes, resolves concurrently, and deduplicates paths", async () => {
        const fetcher = vi.fn() as unknown as typeof fetch;
        const contexts: Array<typeof fetch> = [];
        const resolveEveryRoute = vi.fn(async ({ localizeAndResolve }) => [
            ...localizeAndResolve("/[lang]", {}),
            ...localizeAndResolve("/[lang]/bio", {})
        ]);

        const map = new RevalidationMap<TestResource>({
            supportedLanguages: ["en", "fr"],
            allRoutes: resolveEveryRoute,
            resolvers: {
                first: async (_selection, context) => {
                    contexts.push(context.fetch);
                    return [
                        ...await context.allRoutes(),
                        ...context.localizeAndResolve("/[lang]/bio", {})
                    ];
                },
                second: async (_selection, context) => {
                    contexts.push(context.fetch);
                    return context.allRoutes();
                }
            }
        });

        await expect(map.resolve(
            {
                first: ["one"],
                second: "all"
            },
            { fetch: fetcher }
        )).resolves.toEqual([
            "/en",
            "/fr",
            "/en/bio",
            "/fr/bio"
        ]);

        expect(contexts).toEqual([fetcher, fetcher]);
        expect(resolveEveryRoute).toHaveBeenCalledOnce();
    });

    it("resolves all routes through the same configured callback", async () => {
        const map = new RevalidationMap<TestResource>({
            supportedLanguages: ["de", "en"],
            allRoutes: ({ localizeAndResolve }) => [
                ...localizeAndResolve("/[lang]/contact", {}),
                ...localizeAndResolve("/[lang]/contact", {})
            ],
            resolvers: {}
        });

        await expect(map.resolveAll()).resolves.toEqual([
            "/de/contact",
            "/en/contact"
        ]);
    });

    it("dispatches resource payloads and passes the runtime fetch", async () => {
        const fetcher = vi.fn() as unknown as typeof fetch;
        const resolver = vi.fn((_selection, { fetch, localizeAndResolve }) => {
            expect(fetch).toBe(fetcher);
            return localizeAndResolve("/[lang]/bio", {});
        });
        const map = new RevalidationMap<TestResource>({
            supportedLanguages: ["en"],
            allRoutes: () => [],
            resolvers: { first: resolver }
        });

        await expect(map.resolvePayload(
            { resources: { first: ["bio-id"] } },
            { fetch: fetcher }
        )).resolves.toEqual(["/en/bio"]);

        expect(resolver).toHaveBeenCalledOnce();
    });

    it("dispatches all-pages payloads", async () => {
        const fetcher = vi.fn() as unknown as typeof fetch;
        const resolveEveryRoute = vi.fn(({ fetch, localizeAndResolve }) => {
            expect(fetch).toBe(fetcher);
            return localizeAndResolve("/[lang]", {});
        });
        const map = new RevalidationMap<TestResource>({
            supportedLanguages: ["en", "fr"],
            allRoutes: resolveEveryRoute,
            resolvers: {}
        });

        await expect(map.resolvePayload(
            { pages: "all" },
            { fetch: fetcher }
        )).resolves.toEqual(["/en", "/fr"]);

        expect(resolveEveryRoute).toHaveBeenCalledOnce();
    });

    it("skips empty selections and resources without a resolver", async () => {
        const resolver = vi.fn(async () => ["/unexpected"]);
        const map = new RevalidationMap<TestResource>({
            supportedLanguages: ["en"],
            allRoutes: () => [],
            resolvers: { first: resolver }
        });

        await expect(map.resolve({
            first: [],
            unknown: ["id"]
        } as Partial<Record<TestResource, readonly string[] | "all">>))
            .resolves.toEqual([]);
        expect(resolver).not.toHaveBeenCalled();
    });

    it("propagates resolver failures", async () => {
        const map = new RevalidationMap<TestResource>({
            supportedLanguages: ["en"],
            allRoutes: () => [],
            resolvers: {
                first: async () => {
                    throw new Error("lookup failed");
                }
            }
        });

        await expect(map.resolve({ first: "all" }))
            .rejects.toThrow("lookup failed");
    });
});
