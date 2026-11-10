import { applySecurityHeaders } from "$lib/server/security";
import { describe, expect, it } from "vitest";

describe("applySecurityHeaders", () => {
    it("adds baseline response headers without X-Frame-Options", () => {
        const response = applySecurityHeaders(
            new Response(),
            new URL("https://example.com"),
            false
        );

        expect(response.headers.get("x-content-type-options")).toBe("nosniff");
        expect(response.headers.get("referrer-policy")).toBe(
            "strict-origin-when-cross-origin"
        );
        expect(response.headers.get("permissions-policy")).toBe(
            "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
        );
        expect(response.headers.has("x-frame-options")).toBe(false);
    });

    it("adds HSTS only to production HTTPS responses", () => {
        const productionHttps = applySecurityHeaders(
            new Response(),
            new URL("https://example.com"),
            true
        );
        const productionHttp = applySecurityHeaders(
            new Response(),
            new URL("http://localhost:5173"),
            true
        );
        const developmentHttps = applySecurityHeaders(
            new Response(),
            new URL("https://example.com"),
            false
        );

        expect(productionHttps.headers.get("strict-transport-security")).toBe(
            "max-age=31536000; includeSubDomains"
        );
        expect(productionHttp.headers.has("strict-transport-security")).toBe(false);
        expect(developmentHttps.headers.has("strict-transport-security")).toBe(false);
    });
});
