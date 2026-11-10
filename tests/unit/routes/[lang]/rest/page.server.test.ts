import { load } from "$src/routes/[lang]/[...rest]/+page.server";
import { describe, expect, it } from "vitest";

describe("localized catch-all route", () => {
    it("raises a localized not-found error", () => {
        try {
            load({} as never);
            throw new Error("Expected the page load to fail");
        } catch (error) {
            expect(error).toMatchObject({
                status: 404,
                body: {
                    message: "Not found",
                    translationKey: "errorPage.notFound"
                }
            });
        }
    });
});
