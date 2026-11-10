import { describe, expect, it, vi } from "vitest";

const { getNews } = vi.hoisted(() => ({ getNews: vi.fn() }));
vi.mock("$lib/artkyt", () => ({ artkytClient: { getNews } }));

import { load } from "$src/routes/[lang]/news/[id]/+page.server";

describe("news article loader", () => {
    it.each(["en", "fr"])("returns a translatable 404 for a missing %s article", async (lang) => {
        getNews.mockResolvedValue({ success: false, error: { code: "http_404", status: 404 } });
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        try {
            await expect(load({ fetch: vi.fn(), params: { id: "missing", lang } } as never))
                .rejects.toMatchObject({ status: 404, body: { translationKey: "errorPage.notFound" } });
        } finally {
            log.mockRestore();
        }
    });
});
