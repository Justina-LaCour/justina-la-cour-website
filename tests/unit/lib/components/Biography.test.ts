import { render } from "svelte/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("$lib/i18n/i18n.svelte", () => ({
    useI18n: () => ({
        locale: "fr",
        t: (key: string) => key === "bio.download" ? "Télécharger" : key
    })
}));

import Biography from "$lib/components/Biography.svelte";

describe("Biography", () => {
    it("shows the download action by default", () => {
        const { body } = render(Biography, {
            props: { contentHtml: "<p>Biographie</p>" }
        });

        expect(body).toContain("Biographie");
        expect(body).toContain('download="Bio_FR.html"');
        expect(body).toContain("Télécharger");
    });

    it("can hide the download action", () => {
        const { body } = render(Biography, {
            props: {
                contentHtml: "<p>Biographie</p>",
                downloadable: false
            }
        });

        expect(body).toContain("Biographie");
        expect(body).not.toContain("download=");
        expect(body).not.toContain("Télécharger");
    });
});
