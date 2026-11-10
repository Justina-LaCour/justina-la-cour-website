import type { APIArtist } from "$lib/artkyt/types";
import {
    artistInitials,
    createArtistCardPreview
} from "$lib/components/artistCard/artistCard";
import { render } from "svelte/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("$lib/i18n/i18n.svelte", () => ({
    useI18n: () => ({
        locale: "fr",
        t: (key: string) =>
            key === "artists.website"
                ? "Site de l’artiste"
                : key === "artists.readMore"
                    ? "Lire la suite"
                    : key
    })
}));

import ArtistCard from "$lib/components/artistCard/ArtistCard.svelte";

function artist(overrides: Partial<APIArtist> = {}): APIArtist {
    return {
        id: "artist-id",
        selectedLanguage: "fr",
        name: "Renaud Capuçon",
        artisticRole: "Violon",
        bio: "Biographie de l’artiste.",
        websiteUrl: "https://artist.example/profile",
        image: {
            originalQualityUrl: "https://images.example/original.jpg",
            highQualityUrl: "https://images.example/high.jpg",
            thumbnailUrl: "https://images.example/thumbnail.jpg",
            credits: "Photographe"
        },
        ...overrides
    };
}

describe("artist card normalization", () => {
    it("builds readable initials", () => {
        expect(artistInitials("Renaud Capuçon")).toBe("RC");
        expect(artistInitials("Duo")).toBe("DU");
        expect(artistInitials("  ")).toBe("?");
    });

    it("prefers the high quality image and validates the website", () => {
        expect(createArtistCardPreview(
            artist(),
            "Site de l’artiste"
        )).toEqual({
            artist: artist(),
            imageSrc: "https://images.example/high.jpg",
            imageLowresSrc: "https://images.example/thumbnail.jpg",
            initials: "RC",
            websiteHref: "https://artist.example/profile",
            websiteLabel: "Site de l’artiste",
            readMoreLabel: "Read more"
        });

        expect(createArtistCardPreview(
            artist({ websiteUrl: "javascript:alert(1)" }),
            "Site de l’artiste"
        ).websiteHref).toBeUndefined();
    });
});

describe("ArtistCard", () => {
    it("uses the portrait design by default", () => {
        const { body } = render(ArtistCard, {
            props: { artist: artist() }
        });

        expect(body).toContain('data-artist-card-design="portrait"');
        expect(body).toContain("Renaud Capuçon");
        expect(body).toContain('src="https://images.example/high.jpg"');
        expect(body).toContain("© Photographe");
        expect(body).toContain('href="https://artist.example/profile"');
    });

    it("uses initials and omits an unsafe website", () => {
        const { body } = render(ArtistCard, {
            props: {
                artist: artist({
                    image: undefined,
                    websiteUrl: "javascript:alert(1)"
                })
            }
        });

        expect(body).toContain(">RC<");
        expect(body).not.toContain("javascript:");
        expect(body).not.toContain('target="_blank"');
    });
});
