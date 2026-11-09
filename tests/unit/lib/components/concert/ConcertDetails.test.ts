import { render } from "svelte/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("$lib/i18n/i18n.svelte", () => ({
    useI18n: () => ({
        locale: "fr",
        t: (key: string) =>
            key === "concerts.moreInformation"
                ? "Plus d’informations"
                : key
    })
}));

import type { APIConcert } from "$lib/artkyt/types";
import ConcertDetails from "$lib/components/concert/ConcertDetails.svelte";

function concert(overrides: Partial<APIConcert> = {}): APIConcert {
    return {
        id: "concert-id",
        selectedLanguage: "fr",
        title: "Quintette avec piano",
        shortDescription: "Description courte",
        longDescription: "Description longue",
        url: "https://tickets.example/concert",
        startDate: "2026-09-25",
        venueName: "Salle de l’Étoile",
        performances: [
            {
                id: "performance-one",
                startDate: "2026-09-25",
                startTime: "19:30:00",
                venueName: "Salle de l’Étoile",
                cancelled: false,
                full: false
            },
            {
                id: "performance-two",
                startDate: "2026-09-26",
                startTime: "11:00:00",
                venueName: "Temple d’Yverdon",
                cancelled: false,
                full: false
            }
        ],
        ...overrides
    };
}

describe("ConcertDetails", () => {
    it("renders the title and every performance", () => {
        const { body } = render(ConcertDetails, {
            props: {
                concert: concert(),
                class: "featured-concert"
            }
        });

        expect(body).toContain("<h2");
        expect(body).toContain("Quintette avec piano");
        expect(body).toContain('datetime="2026-09-25T19:30:00"');
        expect(body).toContain('datetime="2026-09-26T11:00:00"');
        expect(body).toContain("Salle de l’Étoile");
        expect(body).toContain("Temple d’Yverdon");
        expect(body).toContain("featured-concert");
    });

    it("renders provided sanitized HTML", () => {
        const { body } = render(ConcertDetails, {
            props: {
                concert: concert(),
                descriptionHtml:
                    '<p>Programme avec <strong>solistes</strong>.</p>'
            }
        });

        expect(body).toContain(
            "<p>Programme avec <strong>solistes</strong>.</p>"
        );
        expect(body).not.toContain("Description longue");
    });

    it("falls back to escaped plain text", () => {
        const { body } = render(ConcertDetails, {
            props: {
                concert: concert({
                    longDescription: "",
                    shortDescription: '<script>alert("unsafe")</script>'
                })
            }
        });

        expect(body).toContain("&lt;script>");
        expect(body).not.toContain("<script>");
    });

    it("renders only validated external links", () => {
        const safe = render(ConcertDetails, {
            props: { concert: concert() }
        }).body;
        const unsafe = render(ConcertDetails, {
            props: {
                concert: concert({ url: "javascript:alert(1)" })
            }
        }).body;

        expect(safe).toContain('href="https://tickets.example/concert"');
        expect(safe).toContain('target="_blank"');
        expect(safe).toContain("Plus d’informations");
        expect(unsafe).not.toContain("javascript:");
        expect(unsafe).not.toContain('target="_blank"');
    });
});
