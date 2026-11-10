import { describe, expect, it } from "vitest";
import {
    normalizeCanonicalUrl,
    safeExternalHttpUrl,
    safeHttpHref
} from "$lib/utils/urls";

describe("normalizeCanonicalUrl", () => {
    it("accepts an HTTPS origin and removes its trailing slash", () => {
        expect(normalizeCanonicalUrl(" https://www.example.com/ ")).toBe(
            "https://www.example.com"
        );
    });

    it.each([
        "http://example.com",
        "https://user@example.com",
        "https://example.com/path",
        "https://example.com?preview=1",
        "https://example.com#content"
    ])("rejects an invalid canonical origin: %s", (value) => {
        expect(() => normalizeCanonicalUrl(value)).toThrow(TypeError);
    });
});

describe("safeExternalHttpUrl", () => {
    it.each([
        ["https://example.com/path", "https://example.com/path"],
        ["http://example.com", "http://example.com/"],
        ["  https://example.com/program  ", "https://example.com/program"]
    ])("accepts absolute HTTP(S) URLs", (input, expected) => {
        expect(safeExternalHttpUrl(input)?.href).toBe(expected);
    });

    it.each([
        null,
        undefined,
        "",
        "/local/path",
        "relative/path",
        "//example.com/path",
        "javascript:alert(1)",
        "data:text/html,unsafe",
        "https://user@example.com/path",
        "https://user:secret@example.com/path",
        "https://"
    ])("rejects unsupported or unsafe external URLs", (input) => {
        expect(safeExternalHttpUrl(input)).toBeNull();
    });
});

describe("safeHttpHref", () => {
    it.each([
        ["/", "/"],
        ["/fr/concerts/example", "/fr/concerts/example"],
        ["https://example.com/concert", "https://example.com/concert"],
        ["http://example.com", "http://example.com"],
        ["  https://example.com/program  ", "https://example.com/program"]
    ])("accepts safe web links", (input, expected) => {
        expect(safeHttpHref(input)).toBe(expected);
    });

    it.each([
        null,
        undefined,
        "",
        "   ",
        "javascript:alert(document.domain)",
        "JaVaScRiPt:alert(document.domain)",
        "data:text/html,<script>alert(1)</script>",
        "//example.com/path",
        "/\\example.com/path",
        "relative/path",
        "mailto:person@example.com",
        "https://user:secret@example.com/path",
        "https://"
    ])("rejects unsafe or unsupported links", (input) => {
        expect(safeHttpHref(input)).toBeNull();
    });
});
