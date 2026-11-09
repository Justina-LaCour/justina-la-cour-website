import { handle } from "$src/hooks.server";
import type { RequestEvent } from "@sveltejs/kit";
import type { ResolveOptions } from "@sveltejs/kit/hooks";
import { describe, expect, it, vi } from "vitest";

const HTML_TEMPLATE = '<!doctype html><html lang="%lang%"><body></body></html>';

async function renderRoute(
    routeId: RequestEvent["route"]["id"],
    lang?: string
): Promise<Response> {
    const path = lang ? `/${lang}/bio` : "/api/revalidate";
    const event = {
        params: lang ? { lang } : {},
        route: { id: routeId },
        url: new URL(path, "https://example.com")
    } as RequestEvent;

    return handle({
        event,
        resolve: async (_event, options?: ResolveOptions) => {
            const html = options?.transformPageChunk
                ? await options.transformPageChunk({
                    html: HTML_TEMPLATE,
                    done: true
                })
                : HTML_TEMPLATE;

            return new Response(html ?? "");
        }
    });
}

describe("server HTML language", () => {
    it.each(["/admin", "/admin/bio", "/admin/postgenerator", "/generic/forms", "/generic/forms/"])(
        "returns 404 for retired infrastructure %s without redirecting old submissions",
        async (pathname) => {
            const resolve = vi.fn();
            for (const method of ["GET", "POST"]) {
                await expect(handle({
                    event: {
                        url: new URL(pathname, "https://example.com"),
                        request: new Request(new URL(pathname, "https://example.com"), { method }),
                        params: { lang: pathname.split("/")[1] }
                    } as RequestEvent,
                    resolve
                })).rejects.toMatchObject({ status: 404 });
            }
            expect(resolve).not.toHaveBeenCalled();
        }
    );
    it.each(["en", "fr"] as const)(
        "renders localized routes with lang=%s",
        async (lang) => {
            const response = await renderRoute("/[lang]/bio", lang);

            await expect(response.text()).resolves.toContain(
                `<html lang="${lang}">`
            );
        }
    );

    it("uses the configured default for non-localized responses", async () => {
        const response = await renderRoute("/api/revalidate");

        await expect(response.text()).resolves.toContain('<html lang="en">');
    });

    it("preserves redirects for unsupported locales", async () => {
        await expect(renderRoute("/[lang]/bio", "it")).rejects.toMatchObject({
            status: 302,
            location: "/en/bio"
        });
    });

    it("continues to apply security headers", async () => {
        const response = await renderRoute("/[lang]/bio", "fr");

        expect(response.headers.get("x-content-type-options")).toBe("nosniff");
        expect(response.headers.get("referrer-policy")).toBe(
            "strict-origin-when-cross-origin"
        );
    });
});
