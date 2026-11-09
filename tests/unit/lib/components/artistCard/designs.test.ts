import type { APIArtist } from "$lib/artkyt/types";
import {
    ArtistCardCinematic,
    ArtistCardEditorial,
    ArtistCardMedallion,
    ArtistCardNocturne,
    ArtistCardPortrait,
    ArtistCardProgramme,
    createArtistCardPreview,
    type ArtistCardDesignId
} from "$lib/components/artistCard";
import type { Component } from "svelte";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";

const artist: APIArtist = {
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
    }
};

const designs: Array<[ArtistCardDesignId, Component]> = [
    ["portrait", ArtistCardPortrait],
    ["editorial", ArtistCardEditorial],
    ["cinematic", ArtistCardCinematic],
    ["nocturne", ArtistCardNocturne],
    ["medallion", ArtistCardMedallion],
    ["programme", ArtistCardProgramme]
];

describe.each(designs)("%s artist card", (designId, Design) => {
    it("renders all available artist information", () => {
        const { body } = render(Design, {
            props: {
                preview: createArtistCardPreview(artist, "Site de l’artiste")
            }
        });

        expect(body).toContain(`data-artist-card-design="${designId}"`);
        expect(body).toContain("Renaud Capuçon");
        expect(body).toContain("Violon");
        expect(body).toContain("Biographie de l’artiste.");
        expect(body).toContain("https://images.example/high.jpg");
        expect(body).toContain("© Photographe");
        expect(body).toContain("https://artist.example/profile");
    });

    it("handles every optional field being absent", () => {
        const minimalArtist: APIArtist = {
            id: "minimal-id",
            selectedLanguage: "fr",
            name: "Duo"
        };
        const { body } = render(Design, {
            props: {
                preview: createArtistCardPreview(
                    minimalArtist,
                    "Site de l’artiste"
                )
            }
        });

        expect(body).toContain("Duo");
        expect(body).toContain(">DU<");
        expect(body).not.toContain("<a");
        expect(body).not.toContain("undefined");
    });
});
