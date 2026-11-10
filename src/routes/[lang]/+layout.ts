import {
    isSupportedLanguage,
    type LocaleModule
} from "$lib/i18n/locales";
import { site } from "$lib/config/config";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ params, route, url }) => {
    const { lang } = params;

    if (!isSupportedLanguage(lang)) {
        // SvelteKit cannot correlate a runtime route union with its params.
        // @ts-expect-error Every route under this layout receives these params.
        const localizedPath = resolve(route.id, {
            ...params,
            lang: site.locales.default
        });
        redirect(302, localizedPath + url.search + url.hash);
    }

    const messages = await import(
        `../../lib/translations/${lang}.ts`
    ) as LocaleModule;

    return {
        lang,
        messages: messages.default
    };
};
import { resolve } from "$app/paths";
