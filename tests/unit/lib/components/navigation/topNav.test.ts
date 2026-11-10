import { render } from "svelte/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("$app/navigation", () => ({
    onNavigate: vi.fn()
}));

vi.mock("$app/state", () => ({
    page: {
        url: new URL("https://preview.example/fr/news/featured/details"),
        route: { id: "/[lang]/news/[id]" },
        params: { lang: "fr", id: "featured" }
    }
}));

vi.mock("$app/paths", () => ({
    resolve: (route: string, params: Record<string, string>) =>
        route
            .replace("[lang]", params.lang)
            .replace("[id]", params.id ?? "")
}));

vi.mock("$lib/config/config", () => ({
    site: {
        identity: {
            name: "Artist Name",
            navigationWordmark: undefined
        },
        locales: {
            supported: ["fr", "en", "de"],
            default: "fr"
        },
        navigation: [
            { route: "/[lang]", nameKey: "nav.home" },
            {
                route: "/[lang]/news/[id]",
                params: { id: "featured" },
                nameKey: "og.concertsDescription",
                labelVariables: { siteName: "Festival" }
            }
        ]
    }
}));

import TopNavProbe from "./fixtures/TopNavProbe.svelte";

describe("TopNav", () => {
    it("resolves dynamic links, interpolates labels and activates descendants", () => {
        const { body } = render(TopNavProbe);

        expect(body).toContain('href="/fr/news/featured"');
        expect(body).toContain("Les prochains concerts et les concerts passés de la violoniste Festival.");
        expect(body).toMatch(
            /href="\/fr\/news\/featured" aria-current="page"/
        );
        expect(body).not.toMatch(/href="\/fr" aria-current="page"/);
    });

    it("keeps language controls for a multilingual site", () => {
        const { body } = render(TopNavProbe);

        expect(body).toContain("Choisir la langue");
        expect(body).toContain('id="language-picker"');
        expect(body).toContain("Français");
        expect(body).toContain("English");
        expect(body).toContain("Deutsch");
    });
});
