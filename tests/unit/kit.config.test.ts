import config from "../../kit.config";
import { describe, expect, it } from "vitest";

const directives = config.csp.directives;

describe("Content Security Policy configuration", () => {
    it("enforces the expected resource boundaries", () => {
        expect(config.csp.mode).toBe("auto");
        expect(directives).toEqual({
            "default-src": ["self"],
            "base-uri": ["none"],
            "object-src": ["none"],
            "script-src": [
                "self",
                "https://www.google.com",
                "https://www.gstatic.com"
            ],
            "script-src-attr": ["none"],
            "style-src": ["self", "unsafe-inline"],
            "font-src": ["self"],
            "img-src": [
                "self",
                "data:",
                "https://www.artkyt.com",
                "https://*.supabase.co",
                "https://ik.imagekit.io"
            ],
            "connect-src": [
                "self",
                "https://www.artkyt.com",
                "https://www.google.com",
                "https://*.supabase.co"
            ],
            "frame-src": [
                "https://www.google.com",
                "https://recaptcha.google.com",
                "https://www.youtube.com",
                "https://open.spotify.com",
                "https://w.soundcloud.com",
                "https://embed.music.apple.com"
            ],
            "frame-ancestors": ["self"],
            "form-action": ["self"],
            "media-src": ["none"],
            "worker-src": ["none"]
        });
    });

    it("does not weaken script execution restrictions", () => {
        const scriptSources = directives?.["script-src"] ?? [];

        expect(scriptSources).not.toContain("unsafe-inline");
        expect(scriptSources).not.toContain("unsafe-eval");
        expect(scriptSources).not.toContain("*");
        expect(scriptSources).not.toContain("http:");
        expect(scriptSources).not.toContain("https:");
    });

    it("allows Supabase without coupling the policy to one project", () => {
        const serializedPolicy = JSON.stringify(directives);

        expect(directives?.["img-src"]).toContain("https://*.supabase.co");
        expect(directives?.["connect-src"]).toContain("https://*.supabase.co");
        expect(serializedPolicy).not.toContain("pfvxyyzhlxjisihiddsk");
    });

    it("allows browser-side requests to the Artkyt API", () => {
        expect(directives?.["connect-src"]).toContain(
            "https://www.artkyt.com"
        );
    });

    it("allows images served through Artkyt's ImageKit CDN", () => {
        expect(directives?.["img-src"]).toContain("https://ik.imagekit.io");
        expect(directives?.["connect-src"]).not.toContain(
            "https://ik.imagekit.io"
        );
    });
});
