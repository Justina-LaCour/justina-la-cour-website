import { resolvePublicErrorTranslationKey } from "$lib/errors";
import { describe, expect, it } from "vitest";

describe("resolvePublicErrorTranslationKey", () => {
    it("uses explicit safe translation keys", () => {
        expect(
            resolvePublicErrorTranslationKey(
                500,
                "errorPage.configuration"
            )
        ).toBe("errorPage.configuration");
        expect(
            resolvePublicErrorTranslationKey(
                503,
                "errorPage.contentUnavailable"
            )
        ).toBe("errorPage.contentUnavailable");
    });

    it("maps all 404 responses to the not-found copy", () => {
        expect(resolvePublicErrorTranslationKey(404)).toBe(
            "errorPage.notFound"
        );
    });

    it("does not use unknown translation keys", () => {
        expect(
            resolvePublicErrorTranslationKey(
                500,
                "errorPage.databasePasswordLeaked"
            )
        ).toBe("errorPage.unexpected");
    });
});
