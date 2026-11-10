import { resolve as resolveRoute } from "$app/paths";
import { isSupportedLanguage } from "$lib/i18n/locales";
import { applySecurityHeaders } from "$lib/server/security";
import {
    site,
    type SupportedLanguage
} from "$lib/config/config";
import { error, redirect } from "@sveltejs/kit";
import type { Handle } from "@sveltejs/kit/hooks";

export const handle: Handle = async ({ event, resolve }) => {
    const pathname = event.url.pathname;
    if (pathname === "/admin" || pathname.startsWith("/admin/")
        || pathname === "/generic/forms" || pathname.startsWith("/generic/forms/")) {
        // Retired infrastructure must not be interpreted as an unsupported locale,
        // particularly POSTs from a contact form opened before the port.
        error(404, "Not found", { translationKey: "errorPage.notFound" });
    }

    let documentLanguage: SupportedLanguage = site.locales.default;

    const lang = event.params.lang;
    if (lang) {
        if (!isSupportedLanguage(lang)) {
            // @ts-expect-error SvelteKit cannot correlate a runtime route with its params.
            const localizedPath = resolveRoute(event.route.id!, {
                ...event.params,
                lang: site.locales.default
            });
            redirect(302, localizedPath + event.url.search);
        }

        documentLanguage = lang;
    }

    const response = await resolve(event, {
        transformPageChunk: ({ html }) =>
            html.replace("%lang%", documentLanguage)
    });

    return applySecurityHeaders(response, event.url);
};
