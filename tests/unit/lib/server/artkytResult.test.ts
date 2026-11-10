import { failure, ok } from "$lib/artkyt/result";
import { optionalArtkyt, requireArtkyt } from "$lib/server/artkytResult";
import { isHttpError } from "@sveltejs/kit";
import { describe, expect, it, vi } from "vitest";

describe("Artkyt server result handling", () => {
    it("unwraps required content", () => {
        expect(requireArtkyt(ok("content"), "test content")).toBe("content");
    });

    it.each([
        ["configuration", undefined, 500, "errorPage.configuration", "Content not configured"],
        ["http_404", 404, 404, "errorPage.notFound", "Content not found"],
        ["network", undefined, 503, "errorPage.contentUnavailable", "Content unavailable"],
        ["invalid_response", 502, 503, "errorPage.contentUnavailable", "Content unavailable"]
    ] as const)(
        "maps %s failures to a sanitized HTTP error",
        (
            code,
            upstreamStatus,
            expectedStatus,
            expectedTranslationKey,
            expectedMessage
        ) => {
            vi.spyOn(console, "error").mockImplementation(() => undefined);

            try {
                requireArtkyt(
                    failure({
                        code,
                        status: upstreamStatus,
                        message: "Sensitive upstream details"
                    }),
                    "test content",
                    { missingIsNotFound: code === "http_404" }
                );
                throw new Error("Expected requireArtkyt to throw");
            } catch (caught) {
                expect(isHttpError(caught, expectedStatus)).toBe(true);
                if (isHttpError(caught)) {
                    expect(caught.body.translationKey).toBe(
                        expectedTranslationKey
                    );
                    expect(caught.body.message).toBe(expectedMessage);
                }
            }
        }
    );

    it("logs and falls back for optional content", () => {
        const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
        const fallback: string[] = [];

        expect(
            optionalArtkyt(
                failure({ code: "network", message: "offline" }),
                fallback,
                "footer links"
            )
        ).toBe(fallback);
        expect(log).toHaveBeenCalled();
    });
});
