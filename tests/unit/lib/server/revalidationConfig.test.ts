import { PUBLIC_ARTKYT_BIO_ID, PUBLIC_ARTKYT_GALLERY_ID } from "$app/env/public";
import { revalidationMap } from "$lib/config/server/revalidation";
import { describe, expect, it } from "vitest";

const home = ["/en", "/fr"];
const bio = ["/en/bio", "/fr/bio"];
const news = ["/en/news", "/fr/news"];
const concerts = ["/en/concerts", "/fr/concerts"];
const media = ["/en/media", "/fr/media"];
const contact = ["/en/contact", "/fr/contact"];
const allPaths = [...home, ...bio, ...news, ...concerts, ...media, ...contact];

describe("site revalidation configuration", () => {
    it("resolves all twelve main pages for full-site and profile link refreshes", async () => {
        await expect(revalidationMap.resolvePayload({ pages: "all" })).resolves.toEqual(allPaths);
        await expect(revalidationMap.resolve({ links: ["link-id"] })).resolves.toEqual(allPaths);
    });

    it("matches the configured biography and gallery IDs", async () => {
        await expect(revalidationMap.resolve({ bios: [PUBLIC_ARTKYT_BIO_ID] }))
            .resolves.toEqual([...home, ...bio]);
        await expect(revalidationMap.resolve({ galleries: [PUBLIC_ARTKYT_GALLERY_ID] }))
            .resolves.toEqual(media);
        await expect(revalidationMap.resolve({ bios: "all", galleries: "all" }))
            .resolves.toEqual([...home, ...bio, ...media]);
        await expect(revalidationMap.resolve({ bios: ["unrelated"], galleries: ["unrelated"] }))
            .resolves.toEqual([]);
    });

    it("refreshes the homepage, news listing and both versions of a changed article", async () => {
        await expect(revalidationMap.resolve({ news: ["first"] }))
            .resolves.toEqual([...home, ...news, "/en/news/first", "/fr/news/first"]);
        await expect(revalidationMap.resolve({ news: "all" })).resolves.toEqual([...home, ...news]);
    });

    it("refreshes home once when concert and recording changes overlap", async () => {
        await expect(revalidationMap.resolve({ concerts: "all", recordings: ["recording"] }))
            .resolves.toEqual([...home, ...concerts, ...media]);
    });

    it("ignores content types without public pages", async () => {
        await expect(revalidationMap.resolve({
            compositions: "all", repertoire: "all", artists: "all"
        })).resolves.toEqual([]);
    });
});
