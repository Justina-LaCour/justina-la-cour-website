import { site } from "$lib/config/config";
import { describe, expect, it } from "vitest";

describe("site navigation", () => {
    it("declares navigation independently in display order", () => {
        expect(site.navigation).toEqual([
            { route: "/[lang]", nameKey: "nav.home" },
            { route: "/[lang]/bio", nameKey: "nav.bio" },
            { route: "/[lang]/news", nameKey: "nav.news" },
            { route: "/[lang]/concerts", nameKey: "nav.concerts" },
            { route: "/[lang]/media", nameKey: "nav.gallery" },
            { route: "/[lang]/contact", nameKey: "nav.contact" }
        ]);
    });
});
