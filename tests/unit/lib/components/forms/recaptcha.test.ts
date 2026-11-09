import { beforeEach, describe, expect, it, vi } from "vitest";

interface FakeScript {
    id: string;
    src: string;
    async: boolean;
    defer: boolean;
    onerror: (() => void) | null;
    remove: ReturnType<typeof vi.fn>;
}

let scripts: FakeScript[];

beforeEach(() => {
    vi.resetModules();
    scripts = [];

    vi.stubGlobal("window", {});
    vi.stubGlobal("document", {
        createElement: vi.fn(() => ({
            id: "",
            src: "",
            async: false,
            defer: false,
            onerror: null,
            remove: vi.fn()
        })),
        head: {
            appendChild: vi.fn((script: FakeScript) => {
                scripts.push(script);
                return script;
            })
        }
    });
});

describe("loadRecaptcha", () => {
    it("shares one load and resolves only after Google's callback", async () => {
        const { loadRecaptcha } = await import(
            "$lib/components/forms/elements/recaptcha"
        );
        const first = loadRecaptcha();
        const second = loadRecaptcha();
        let resolved = false;
        void first.then(() => (resolved = true));

        await Promise.resolve();

        expect(first).toBe(second);
        expect(scripts).toHaveLength(1);
        expect(scripts[0].src).toContain(
            "onload=onRecaptchaLoaded&render=explicit"
        );
        expect(resolved).toBe(false);

        const api = {
            render: vi.fn(() => 1),
            reset: vi.fn()
        };
        window.grecaptcha = api;
        window.onRecaptchaLoaded?.();

        await expect(first).resolves.toBe(api);
        expect(resolved).toBe(true);
    });

    it("clears a failed load so a later call can retry", async () => {
        const { loadRecaptcha } = await import(
            "$lib/components/forms/elements/recaptcha"
        );
        const first = loadRecaptcha();
        const rejection = expect(first).rejects.toThrow(
            "reCAPTCHA failed to load"
        );

        scripts[0].onerror?.();
        await rejection;

        expect(scripts[0].remove).toHaveBeenCalledOnce();

        const second = loadRecaptcha();
        expect(second).not.toBe(first);
        expect(scripts).toHaveLength(2);
    });

    it("rejects outside the browser", async () => {
        vi.unstubAllGlobals();
        vi.resetModules();
        const { loadRecaptcha } = await import(
            "$lib/components/forms/elements/recaptcha"
        );

        await expect(loadRecaptcha()).rejects.toThrow(
            "reCAPTCHA can only be loaded in the browser"
        );
    });
});
