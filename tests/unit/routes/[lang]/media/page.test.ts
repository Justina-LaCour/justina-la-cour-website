import { render } from "svelte/server";
import type { ComponentProps } from "svelte";
import { describe, expect, it, vi } from "vitest";
import { TranslationLocaleRecord } from "$lib/i18n/localeRecord";
import en from "$lib/translations/en";
import fr from "$lib/translations/fr";
import { emptyPaginatedList } from "$lib/pagination/empty";

const messagesByLocale = { en, fr };

const { state } = vi.hoisted(() => ({ state: { locale: "en" as "en" | "fr" } }));
vi.mock("$lib/i18n/i18n.svelte", () => ({
    useI18n: () => ({
        locale: state.locale,
        t: (key: string) => new TranslationLocaleRecord(messagesByLocale[state.locale])
            .translate(key, { siteName: "Justina La Cour" })
    })
}));
vi.mock("$lib/assets/images/media", () => ({ mediaBanner: { openGraphSrc: "/media.jpg" } }));
vi.mock("$app/state", () => ({ page: {
    url: new URL("https://justina.example/en/media"),
    route: { id: "/[lang]/media" }, params: { lang: "en" }
} }));
vi.mock("$app/paths", () => ({ resolve: (_route: string, params: { lang: string }) => `/${params.lang}/media` }));

import Media from "$src/routes/[lang]/media/+page.svelte";
type PageData = ComponentProps<typeof Media>["data"];

function pageData(overrides: Partial<PageData> = {}): PageData {
    return {
        lang: state.locale,
        gallery: { id: "photos", selectedLanguage: state.locale, title: "Photos", description: "", images: [] },
        recordings: emptyPaginatedList(), ...overrides
    } as PageData;
}

describe("media page", () => {
    it.each(["en", "fr"] as const)("renders localized empty states in %s", (locale) => {
        state.locale = locale;
        const { body } = render(Media, { props: { data: pageData() } });
        const messages = messagesByLocale[locale];
        expect(body).toContain(messages.gallery.photosEmpty);
        expect(body).toContain(messages.gallery.recordingsEmpty);
    });

    it("retains recordings pagination followed by the photo gallery", () => {
        state.locale = "en";
        const { body, head } = render(Media, { props: { data: pageData({
            gallery: {
                id: "photos", selectedLanguage: "en", title: "Performance photos", description: "On stage",
                images: [{ originalQualityUrl: "https://www.artkyt.com/photo.jpg", credits: "Photographer" }]
            },
            recordings: {
                items: [{ id: "recording", selectedLanguage: "en", title: "Violin recital", description: "",
                    platform: "youtube", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }],
                pagination: { page: 0, pageSize: 30, total: 31 }
            }
        }) } });
        expect(body.indexOf("Violin recital")).toBeLessThan(body.indexOf("Performance photos"));
        expect(body).toContain("https://www.youtube.com/embed/dQw4w9WgXcQ");
        expect(body).toContain(en.pagination.loadMore);
        expect(body).toContain("photo.jpg");
        expect(head).toContain("/media.jpg");
    });
});
