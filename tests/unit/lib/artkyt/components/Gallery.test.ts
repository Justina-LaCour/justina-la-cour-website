import Gallery from "$lib/artkyt/components/Gallery.svelte";
import type { APIGallery } from "$lib/artkyt/types";
import { render } from "svelte/server";
import { describe, expect, it, vi } from "vitest";

const gallery = {
    id: "gallery-id",
    selectedLanguage: "en",
    title: "Portraits",
    description: "Studio and concert portraits",
    images: []
} satisfies APIGallery;

function renderGallery(density?: "compact" | "comfortable") {
    return render(Gallery, {
        props: {
            gallery,
            onImageClick: vi.fn(),
            density
        }
    }).body;
}

describe("Gallery density", () => {
    it("uses compact density by default", () => {
        expect(renderGallery()).toContain("gallery-grid compact");
    });

    it("renders comfortable density on request", () => {
        expect(renderGallery("comfortable")).toContain(
            "gallery-grid comfortable"
        );
    });

    it("caps the minimum column width at the available container width", () => {
        expect(renderGallery()).toContain(
            "minmax(min(100%, var(--gallery-min-width)), 1fr)"
        );
    });
});
