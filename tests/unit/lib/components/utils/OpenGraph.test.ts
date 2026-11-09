import { render } from "svelte/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockPage } = vi.hoisted(() => ({
    mockPage: {
        url: new URL("https://preview.example/fr/bio"),
        route: { id: "/[lang]/bio" },
        params: { lang: "fr" }
    }
}));

vi.mock("$app/state", () => ({ page: mockPage }));
vi.mock("$app/paths", () => ({
    resolve: (_route: string, params: { lang: string }) =>
        `/${params.lang}/bio`
}));
vi.mock("$lib/config/config", () => ({
    site: {
        identity: {
            name: "Artist Name",
            canonicalUrl: "https://artist.example"
        },
        locales: {
            supported: ["fr", "en", "de"],
            default: "fr"
        }
    }
}));

import OpenGraph from "$lib/components/utils/OpenGraph.svelte";
import { normalizeOpenGraphLocale } from "$lib/components/utils/openGraph";

describe("OpenGraph metadata", () => {
    beforeEach(() => {
        mockPage.params.lang = "fr";
    });

    it("omits empty optional metadata and uses a summary card", () => {
        const { head } = render(OpenGraph, {
            props: {
                title: "Biography",
                description: "   ",
                imageUrl: "   "
            }
        });

        expect(head).toContain('property="og:type" content="website"');
        expect(head).toContain('name="twitter:card" content="summary"');
        expect(head).toContain('name="twitter:title" content="Biography"');
        expect(head).not.toContain('name="description"');
        expect(head).not.toContain('property="og:description"');
        expect(head).not.toContain('name="twitter:description"');
        for (const property of [
            "og:image",
            "og:image:secure_url",
            "og:image:type",
            "og:image:width",
            "og:image:height"
        ]) {
            expect(head).not.toContain(`property="${property}"`);
        }
        expect(head).not.toContain('name="twitter:image"');
    });

    it("emits complete image and large-card metadata when an image exists", () => {
        const { head } = render(OpenGraph, {
            props: {
                title: "Biography",
                description: "Artist biography",
                imageUrl: "/images/share.webp",
                imageWidth: 1600,
                imageHeight: 900,
                imageType: "image/webp"
            }
        });

        expect(head).toContain(
            'name="twitter:card" content="summary_large_image"'
        );
        expect(head).toContain('name="description" content="Artist biography"');
        expect(head).toContain(
            'property="og:description" content="Artist biography"'
        );
        expect(head).toContain(
            'name="twitter:description" content="Artist biography"'
        );
        expect(head).toContain(
            'property="og:image" content="https://preview.example/images/share.webp"'
        );
        expect(head).toContain(
            'property="og:image:secure_url" content="https://preview.example/images/share.webp"'
        );
        expect(head).toContain('property="og:image:type" content="image/webp"');
        expect(head).toContain('property="og:image:width" content="1600"');
        expect(head).toContain('property="og:image:height" content="900"');
        expect(head).toContain(
            'name="twitter:image" content="https://preview.example/images/share.webp"'
        );
    });

    it("emits the current Open Graph locale and excludes it from alternates", () => {
        const { head } = render(OpenGraph, {
            props: { title: "Biography" }
        });

        expect(head).toContain('property="og:locale" content="fr"');
        expect(head).toContain(
            'property="og:locale:alternate" content="en"'
        );
        expect(head).toContain(
            'property="og:locale:alternate" content="de"'
        );
        expect(head).not.toContain(
            'property="og:locale:alternate" content="fr"'
        );
    });

    it("normalizes regional locale separators without guessing a region", () => {
        expect(normalizeOpenGraphLocale("fr-CH")).toBe("fr_CH");
        expect(normalizeOpenGraphLocale("fr")).toBe("fr");
    });
});
