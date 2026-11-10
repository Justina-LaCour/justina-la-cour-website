import { describe, expect, it } from "vitest";
import { readableCodeLabel, textExcerpt } from "$lib/utils/text";

describe("textExcerpt", () => {
    it("normalizes whitespace and truncates on a word boundary", () => {
        expect(textExcerpt("  A short\narticle with several words. ", 24))
            .toBe("A short article with…");
    });

    it("leaves short text unchanged", () => {
        expect(textExcerpt("Short text", 24)).toBe("Short text");
    });
});

describe("readableCodeLabel", () => {
    it("turns an unknown machine code into a readable label", () => {
        expect(readableCodeLabel("new_music-format")).toBe("New music format");
    });
});
