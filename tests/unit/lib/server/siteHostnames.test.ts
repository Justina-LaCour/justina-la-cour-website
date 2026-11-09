import { parseSiteHostnames } from "$lib/server/siteHostnames";
import { describe, expect, it } from "vitest";

describe("parseSiteHostnames", () => {
    it("normalizes and deduplicates valid bare hostnames", () => {
        expect([
            ...parseSiteHostnames(
                " EXAMPLE.com, www.example.com, example.com "
            )
        ]).toEqual(["example.com", "www.example.com"]);
    });

    it("rejects an empty configuration", () => {
        expect(parseSiteHostnames("  , ").size).toBe(0);
    });

    it("rejects the entire configuration when an entry is invalid", () => {
        for (const value of [
            "https://example.com",
            "example.com/path",
            "example.com:443",
            "*.example.com",
            "example.com,https://www.example.com"
        ]) {
            expect(parseSiteHostnames(value).size).toBe(0);
        }
    });
});
