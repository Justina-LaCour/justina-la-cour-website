import { render } from "svelte/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("$app/navigation", () => ({
    onNavigate: vi.fn()
}));

vi.mock("$app/state", () => ({
    page: {
        url: new URL("https://preview.example/fr"),
        route: { id: "/[lang]" },
        params: { lang: "fr" }
    }
}));

vi.mock("$app/paths", () => ({
    resolve: (route: string, params: Record<string, string>) =>
        route.replace("[lang]", params.lang)
}));

vi.mock("$lib/config/config", () => ({
    site: {
        identity: {
            name: "Artist Name",
            navigationWordmark: undefined
        },
        locales: {
            supported: ["fr"],
            default: "fr"
        },
        navigation: [{ route: "/[lang]", nameKey: "nav.home" }]
    }
}));

import TopNavProbe from "./fixtures/TopNavProbe.svelte";

describe("TopNav with one locale", () => {
    it("omits desktop and mobile language controls", () => {
        const { body } = render(TopNavProbe);

        expect(body).not.toContain("Choisir la langue");
        expect(body).not.toContain('id="language-picker"');
        expect(body).not.toContain("Français");
    });
});
