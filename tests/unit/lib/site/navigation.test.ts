import type { SiteNavigationItem } from "$lib/site/definition";
import { isNavigationPathActive } from "$lib/site/navigation";
import { describe, expect, it } from "vitest";

const staticItem = {
    route: "/[lang]/bio",
    nameKey: "nav.news"
} satisfies SiteNavigationItem;

const dynamicItem = {
    route: "/[lang]/[...rest]",
    params: { rest: "featured" },
    nameKey: "nav.news",
    labelVariables: { section: "featured" }
} satisfies SiteNavigationItem;

// @ts-expect-error Dynamic routes require every non-language route parameter.
const missingDynamicParams: SiteNavigationItem = { route: "/[lang]/[...rest]", nameKey: "nav.news" };

// @ts-expect-error Static routes do not accept route parameters.
const unexpectedStaticParams: SiteNavigationItem = { route: "/[lang]/bio", params: {}, nameKey: "nav.news" };

describe("site navigation contracts", () => {
    it("accepts static and fully parameterized dynamic routes", () => {
        expect(staticItem.route).toBe("/[lang]/bio");
        expect(dynamicItem.params).toEqual({ rest: "featured" });
    });
});

describe("isNavigationPathActive", () => {
    it("matches exact paths and normalizes trailing slashes", () => {
        expect(isNavigationPathActive("/fr/news", "/fr/news")).toBe(true);
        expect(isNavigationPathActive("/fr/news/", "/fr/news")).toBe(true);
        expect(isNavigationPathActive("/fr/news", "/fr/news/")).toBe(true);
    });

    it("matches descendants of non-root navigation paths", () => {
        expect(
            isNavigationPathActive("/fr/news/article-id", "/fr/news")
        ).toBe(true);
    });

    it("keeps the locale root active only on the homepage", () => {
        expect(isNavigationPathActive("/fr", "/fr")).toBe(true);
        expect(isNavigationPathActive("/fr/news", "/fr")).toBe(false);
    });

    it("rejects siblings and segment-prefix collisions", () => {
        expect(isNavigationPathActive("/fr/gallery", "/fr/news")).toBe(false);
        expect(isNavigationPathActive("/fr/newspaper", "/fr/news")).toBe(false);
    });
});
