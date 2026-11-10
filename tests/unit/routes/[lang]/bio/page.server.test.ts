import { describe, expect, it, vi } from "vitest";
import { render } from "svelte/server";

const { getBio } = vi.hoisted(() => ({ getBio: vi.fn() }));
vi.mock("$lib/artkyt", () => ({ artkytClient: { getBio } }));
vi.mock(import("$app/env/public"), async (original) => ({
    ...await original(),
    PUBLIC_ARTKYT_BIO_ID: "bio-id"
}));
vi.mock("$lib/server/isr", () => ({ ISR_CONFIG: { slowMoving: {} } }));
vi.mock("$lib/i18n/i18n.svelte", () => ({
    useI18n: () => ({ locale: "fr", t: () => "Download biography" })
}));

import { load } from "$src/routes/[lang]/bio/+page.server";
import Biography from "$lib/components/Biography.svelte";
import { ARTKYT_ISR_CACHE } from "$lib/server/artkytCache";

describe("HTML biography", () => {
    it("sanitizes API HTML before rendering and downloading with the existing cache policy", async () => {
        getBio.mockResolvedValue({
            success: true,
            value: { bio: { content: '<p>Hello <strong>world</strong></p><script>alert(1)</script><a href="javascript:alert(1)">link</a>' } }
        });
        const fetch = vi.fn();
        const result = await load({ fetch, params: { lang: "fr" } } as never);
        expect(getBio).toHaveBeenCalledWith(
            { id: "bio-id", lang: "fr", format: "html" },
            { fetch, cache: ARTKYT_ISR_CACHE }
        );
        expect(result).toEqual({ bioHtml: '<p>Hello <strong>world</strong></p><a>link</a>' });
        const { body } = render(Biography, { props: { contentHtml: result!.bioHtml } });
        expect(body).toContain("<strong>world</strong>");
        expect(body).toContain('download="Bio_FR.html"');
        expect(body).not.toContain("alert");
        const encoded = body.match(/href="data:text\/html;charset=utf-8,([^"]+)"/)?.[1];
        expect(decodeURIComponent(encoded!)).toBe(result!.bioHtml);
    });
});
