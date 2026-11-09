import SimpleHero from "$lib/components/homepage/SimpleHero.svelte";
import type { LazyImageAsset } from "$lib/components/images/imageTypes";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";

const responsiveImage = {
    src: "/images/home-mobile.webp",
    lowresSrc: "/images/home-mobile-placeholder.webp",
    lowresFilter: "brightness(0.75)",
    sizes: "100vw",
    sources: [
        {
            media: "(min-width: 768px)",
            type: "image/webp",
            src: "/images/home-desktop.webp",
            lowresSrc: "/images/home-desktop-placeholder.webp",
            sizes: "100vw"
        }
    ]
} satisfies LazyImageAsset;

describe("SimpleHero", () => {
    it("renders its content and forwards the complete responsive image contract", () => {
        const { body } = render(SimpleHero, {
            props: {
                title: "Artist Name",
                tagline: "Cellist and composer",
                image: responsiveImage,
                imageAlt: "Artist holding a cello"
            }
        });

        expect(body).toContain("Artist Name");
        expect(body).toContain("Cellist and composer");
        expect(body).toContain('alt="Artist holding a cello"');
        expect(body).toContain('loading="eager"');
        expect(body).toContain('fetchpriority="high"');
        expect(body).toContain('media="(min-width: 768px)"');
        expect(body).toContain("/images/home-desktop.webp");
        expect(body).toContain("/images/home-desktop-placeholder.webp");
        expect(body).toContain("brightness(0.75)");
    });

    it("treats the hero image as decorative by default", () => {
        const { body } = render(SimpleHero, {
            props: {
                title: "Artist Name",
                tagline: "Cellist and composer",
                image: { src: "/images/home.webp" }
            }
        });

        expect(body).toContain('alt=""');
    });
});
