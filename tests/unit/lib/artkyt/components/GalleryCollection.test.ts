import GalleryCollection from "$lib/artkyt/components/GalleryCollection.svelte";
import type { APIGallery } from "$lib/artkyt/types";
import { render } from "svelte/server";
import { describe, expect, it, vi } from "vitest";

const galleries = [
    {
        id: "portraits",
        selectedLanguage: "en",
        title: "Portraits",
        description: "Studio portraits",
        images: []
    },
    {
        id: "concerts",
        selectedLanguage: "en",
        title: "Concerts",
        description: "Live photographs",
        images: []
    }
] satisfies APIGallery[];

function renderCollection(density?: "compact" | "comfortable") {
    return render(GalleryCollection, {
        props: {
            galleries,
            onImageClick: vi.fn(),
            density
        }
    }).body;
}

describe("GalleryCollection density", () => {
    it("keeps compact density by default for every gallery", () => {
        expect(renderCollection().match(/gallery-grid compact/g)).toHaveLength(2);
    });

    it("forwards comfortable density to every gallery", () => {
        expect(
            renderCollection("comfortable").match(/gallery-grid comfortable/g)
        ).toHaveLength(2);
    });

    it("renders no collection wrapper for an empty list", () => {
        const { body } = render(GalleryCollection, {
            props: {
                galleries: [],
                onImageClick: vi.fn()
            }
        });

        expect(body).not.toContain("<div");
        expect(body).not.toContain("<article");
    });
});
