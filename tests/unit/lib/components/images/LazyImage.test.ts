import LazyImage from "$lib/components/images/LazyImage.svelte";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";

describe("LazyImage low-resolution filter", () => {
    it("keeps the placeholder unchanged by default", () => {
        const { body } = render(LazyImage, {
            props: {
                src: "/image.jpg",
                lowresSrc: "/image-lowres.jpg"
            }
        });

        expect(body).toContain("--lowres-filter: blur(15px)");
    });

    it("combines an optional visual filter with the blur", () => {
        const { body } = render(LazyImage, {
            props: {
                src: "/image.jpg",
                lowresSrc: "/image-lowres.jpg",
                lowresBlurRadius: "10px",
                lowresFilter: "brightness(0.75)"
            }
        });

        expect(body).toContain(
            "--lowres-filter: blur(10px) brightness(0.75)"
        );
    });
});


describe("LazyImage crop override", () => {
    it("only sets a crop override when requested", () => {
        const props = { src: "/image.jpg", lowresSrc: "/preview.jpg" };
        const inherited = render(LazyImage, { props }).body;
        const explicit = render(LazyImage, {
            props: { ...props, objectPosition: "20% 80%" }
        }).body;
        expect(inherited).not.toContain("--image-object-position:");
        expect(explicit).toContain("--image-object-position: 20% 80%");
    });
});
