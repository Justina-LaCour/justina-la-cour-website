import { PUBLIC_ARTKYT_BIO_ID } from "$app/env/public";
import { ARTKYT_ISR_CACHE } from "$lib/server/artkytCache";
import { beforeEach, describe, expect, it, vi } from "vitest";

const client = vi.hoisted(() => ({
    getBio: vi.fn(),
    getNewsList: vi.fn(),
    getConcertsList: vi.fn()
}));
vi.mock("$lib/artkyt", () => ({ artkytClient: client }));

import { load } from "$src/routes/[lang]/+page.server";

const success = <T>(value: T) => ({ success: true, value });
const items = (count: number) => Array.from({ length: count }, (_, id) => ({ id }));
const fetch = vi.fn();

describe("homepage previews", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        client.getBio.mockResolvedValue(success({ bio: { content: "  About\n Justina  " } }));
        client.getNewsList.mockResolvedValue(success({ items: items(6) }));
        client.getConcertsList.mockResolvedValue(success({ items: items(8) }));
    });

    it.each(["en", "fr"])("requests bounded, fresh Artkyt previews in %s", async (lang) => {
        const data = await load({ fetch, params: { lang } } as never);
        expect(data).toEqual({
            bioExcerpt: "About Justina", latestNews: items(3),
            upcomingConcerts: items(5)
        });

        const options = { fetch, cache: ARTKYT_ISR_CACHE };
        expect(ARTKYT_ISR_CACHE.mode).toBe("bypass");
        expect(client.getBio).toHaveBeenCalledWith({ id: PUBLIC_ARTKYT_BIO_ID, lang, format: "plain" }, options);
        expect(client.getNewsList).toHaveBeenCalledWith({ lang, pagination: { pageSize: 3 } }, options);
        expect(client.getConcertsList).toHaveBeenCalledWith({
            lang, filter: expect.objectContaining({ sort: "startDateAsc", fromDate: expect.any(Date) }),
            pagination: { pageSize: 5 }
        }, options);
    });

    it("retains healthy previews when another resource fails", async () => {
        client.getBio.mockResolvedValue({ success: false, error: { code: "network" } });
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        try {
            await expect(load({ fetch, params: { lang: "en" } } as never)).resolves.toEqual({
                bioExcerpt: null, latestNews: items(3), upcomingConcerts: items(5)
            });
        } finally {
            log.mockRestore();
        }
    });
});
