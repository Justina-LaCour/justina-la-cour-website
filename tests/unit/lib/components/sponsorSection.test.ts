import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import type { APIGallery } from "$lib/artkyt/types";
import SponsorSection from "$lib/components/sponsorSection/SponsorSection.svelte";

const gallery: APIGallery = {
    id: "partners",
    selectedLanguage: "en",
    title: "Partners",
    description: "Thanks to our supporters.",
    images: [
        { originalQualityUrl: "/partner.svg", credits: "Foundation" },
        { originalQualityUrl: "javascript:alert(1)", credits: "Unsafe" }
    ]
};

function renderGalleries(galleries: APIGallery[]): string {
    return render(SponsorSection, {
        props: { id: "supporters", title: "Our supporters", galleries }
    }).body;
}

describe("SponsorSection", () => {
    it("renders labelled logos, descriptions and caller-owned headings", () => {
        const body = renderGalleries([gallery]);
        expect(body).toContain('aria-labelledby="supporters"');
        expect(body).toContain('id="supporters"');
        expect(body).toContain("Our supporters");
        expect(body).toContain("Foundation");
        expect(body).toContain("Thanks to our supporters.");
        expect(body).toContain('loading="lazy"');
        expect(body).not.toContain("Unsafe");
        expect(body).not.toContain("javascript:");
    });

    it("falls back to usable image sources and gallery titles", () => {
        const body = renderGalleries([{
            ...gallery,
            images: [{
                highQualityUrl: "javascript:alert(1)",
                originalQualityUrl: "/fallback.svg",
                credits: " "
            }]
        }]);
        expect(body).toContain('src="/fallback.svg"');
        expect(body).toContain("Partners");
    });

    it("omits empty and entirely unusable groups including their descriptions", () => {
        const empty = { ...gallery, images: [] };
        const unsafe = { ...gallery, images: [gallery.images[1]] };
        expect(renderGalleries([empty, unsafe])).not.toContain("<section");
        const body = renderGalleries([gallery, { ...empty, id: "empty", description: "Hidden" }]);
        expect(body).not.toContain("Hidden");
    });
});
