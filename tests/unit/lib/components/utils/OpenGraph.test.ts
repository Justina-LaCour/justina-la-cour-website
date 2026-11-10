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
            supported: ["fr", "en", "da"],
            default: "fr",
            openGraph: { fr: "fr_FR", en: "en_GB", da: "da_DK" }
        }
    }
}));

import OpenGraph from "$lib/components/utils/OpenGraph.svelte";

describe("OpenGraph metadata", () => {
    beforeEach(() => {
        mockPage.params.lang = "fr";
    });

    it("omits empty optional metadata and uses a summary card", () => {
        const { head } = render(OpenGraph, {
            props: {
                title: "Biography",
                description: "   ",
                imageUrl: "   ",
                imageAlt: "A violinist on stage"
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
            "og:image:height",
            "og:image:alt"
        ]) {
            expect(head).not.toContain(`property="${property}"`);
        }
        expect(head).not.toContain('name="twitter:image"');
        expect(head).not.toContain('name="twitter:image:alt"');
    });

    it("emits complete image and large-card metadata when an image exists", () => {
        const { head } = render(OpenGraph, {
            props: {
                title: "Biography",
                description: "Artist biography",
                imageUrl: "/images/share.webp",
                imageAlt: "A violinist on stage",
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
        expect(head).toContain('property="og:image:alt" content="A violinist on stage"');
        expect(head).toContain(
            'name="twitter:image" content="https://preview.example/images/share.webp"'
        );
        expect(head).toContain('name="twitter:image:alt" content="A violinist on stage"');
    });

    it("emits the current Open Graph locale and excludes it from alternates", () => {
        mockPage.params.lang = "da";
        const { head } = render(OpenGraph, {
            props: { title: "Biografi" }
        });

        expect(head).toContain('property="og:locale" content="da_DK"');
        expect(head).toContain(
            'property="og:locale:alternate" content="en_GB"'
        );
        expect(head).toContain(
            'property="og:locale:alternate" content="fr_FR"'
        );
        expect(head).not.toContain(
            'property="og:locale:alternate" content="da_DK"'
        );
        expect(head).toContain('hreflang="da" href="https://artist.example/da/bio"');
    });
});
