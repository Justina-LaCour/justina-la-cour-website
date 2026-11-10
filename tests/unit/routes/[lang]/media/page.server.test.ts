import { PUBLIC_ARTKYT_GALLERY_ID } from "$app/env/public";
import { emptyPaginatedList } from "$lib/pagination/empty";
import { ARTKYT_ISR_CACHE } from "$lib/server/artkytCache";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getGallery, getRecordingsList } = vi.hoisted(() => ({
    getGallery: vi.fn(),
    getRecordingsList: vi.fn()
}));
vi.mock("$lib/artkyt", () => ({ artkytClient: { getGallery, getRecordingsList } }));

import { load } from "$src/routes/[lang]/media/+page.server";

describe("media loader", () => {
    const fetch = vi.fn();
    const recordings = emptyPaginatedList(30);
    const gallery = {
        id: PUBLIC_ARTKYT_GALLERY_ID,
        title: "Photos",
        description: "",
        images: [],
        selectedLanguage: "fr"
    };

    beforeEach(() => {
        vi.clearAllMocks();
        getGallery.mockResolvedValue({ success: true, value: { gallery } });
        getRecordingsList.mockResolvedValue({ success: true, value: recordings });
    });

    it.each(["en", "fr"])("loads the configured gallery and recordings in %s", async (lang) => {
        const result = await load({ fetch, params: { lang } } as never);
        expect(result).toEqual({ gallery, recordings });
        expect(getGallery).toHaveBeenCalledWith(
            { id: PUBLIC_ARTKYT_GALLERY_ID, lang, format: "plain" },
            { fetch, cache: ARTKYT_ISR_CACHE }
        );
        expect(getRecordingsList).toHaveBeenCalledWith(
            { lang, pagination: { pageSize: 30 } },
            { fetch, cache: ARTKYT_ISR_CACHE }
        );
    });

    it.each([getGallery, getRecordingsList])("reports an upstream failure", async (request) => {
        const error = request === getGallery
            ? { code: "http_404", status: 404, message: "Missing configured gallery" }
            : { code: "network", message: "Offline" };
        request.mockResolvedValue({ success: false, error });
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        try {
            await expect(load({ fetch, params: { lang: "fr" } } as never)).rejects.toMatchObject({ status: 503 });
        } finally {
            log.mockRestore();
        }
    });
});
