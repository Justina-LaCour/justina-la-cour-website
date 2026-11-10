import { render } from "svelte/server";
import { describe, expect, it, vi } from "vitest";

const { mockPage } = vi.hoisted(() => ({
    mockPage: {
        url: new URL("https://preview.example/fr/news/article-id"),
        route: { id: "/[lang]/news/[id]" },
        params: { lang: "fr", id: "article-id" }
    }
}));

vi.mock("$app/state", () => ({ page: mockPage }));
vi.mock("$app/paths", () => ({
    resolve: (_route: string, params: { lang: string; id?: string }) =>
        `/${params.lang}/news${params.id ? `/${params.id}` : ""}`
}));
vi.mock("$lib/config/config", () => ({
    site: {
        identity: {
            name: "Artist Name",
            titleSuffix: " - Artist Name",
            canonicalUrl: "https://artist.example"
        },
        locales: {
            supported: ["fr", "en", "de"],
            default: "fr",
            openGraph: { fr: "fr_FR", en: "en_GB", de: "de_DE" }
        }
    }
}));

import PageStructure from "$lib/components/navigation/pageStructure/PageStructure.svelte";
import PageStructureCinematicCover from "$lib/components/navigation/pageStructure/designs/PageStructureCinematicCover.svelte";
import PageStructureDarkGallery from "$lib/components/navigation/pageStructure/designs/PageStructureDarkGallery.svelte";
import PageStructureFloatingPortrait from "$lib/components/navigation/pageStructure/designs/PageStructureFloatingPortrait.svelte";
import PageStructureLayeredPoster from "$lib/components/navigation/pageStructure/designs/PageStructureLayeredPoster.svelte";
import PageStructureSimpleTwoColumns from "$lib/components/navigation/pageStructure/designs/PageStructureSimpleTwoColumns.svelte";
import type {
    PageStructureDesign,
    PageStructureDesignConfig,
    PageStructureDesignProps
} from "$lib/components/navigation/pageStructure/pageStructure";
import type { PageStructureTransitionDesign } from "$lib/components/navigation/pageStructure/pageStructureTransitions";
import PageStructureDesignProbe from "./fixtures/PageStructureDesignProbe.svelte";

const backTo = {
    url: "/fr/news",
    text: "Retour aux actualités"
};

const config: PageStructureDesignConfig = {
    bannerPosition: "center center",
    bannerMobilePosition: "center center",
    mobileHeaderHeight: "28rem",
    lgHeaderImageMinHeight: "55rem",
    titleSize: "default",
    layout: "content-only"
};

const designs: Array<[
    string,
    PageStructureDesign,
    PageStructureTransitionDesign
]> = [
    ["Simple Two Columns", PageStructureSimpleTwoColumns, "simple-two-columns"],
    ["Cinematic Cover", PageStructureCinematicCover, "cinematic-cover"],
    ["Dark Gallery", PageStructureDarkGallery, "dark-gallery"],
    ["Floating Portrait", PageStructureFloatingPortrait, "floating-portrait"],
    ["Layered Poster", PageStructureLayeredPoster, "layered-poster"]
];

const layouts: PageStructureDesignConfig["layout"][] = [
    "image-left",
    "image-right",
    "content-only"
];

const transitionCases = designs.flatMap(([name, Design, transitionDesign]) =>
    layouts.map((layout) => ({ name, Design, transitionDesign, layout }))
);

function designProps(
    overrides: Partial<PageStructureDesignProps> = {}
): PageStructureDesignProps {
    return {
        title: "Article title",
        config,
        ...overrides
    };
}

describe("PageStructure design configuration", () => {
    it("hides banner credits only when explicitly requested", () => {
        const props = {
            title: "Article", ogDescription: "Description",
            config: {
                bannerImage: { src: "/portrait.jpg" },
                bannerPhotoCredits: "Test Photographer"
            }
        };
        const visible = render(PageStructure, { props });
        const hidden = render(PageStructure, {
            props: { ...props, config: { ...props.config, showBannerPhotoCredits: false } }
        });
        expect(visible.body).toContain("Test Photographer");
        expect(hidden.body).not.toContain("Test Photographer");
        expect(hidden.body).toContain("/portrait.jpg");
    });

    it("uses metadataTitle when set and otherwise falls back to the visible title", () => {
        const fallback = render(PageStructure, {
            props: {
                title: "Visible title",
                ogDescription: "Description"
            }
        });
        const overridden = render(PageStructure, {
            props: {
                title: "Visible title",
                metadataTitle: "Dedicated metadata title",
                ogDescription: "Description"
            }
        });

        expect(fallback.head).toContain(
            "<title>Visible title - Artist Name</title>"
        );
        expect(overridden.head).toContain(
            "<title>Dedicated metadata title</title>"
        );
        expect(overridden.body).toContain("Visible title");
    });

    it("resolves header dimensions and title sizing before rendering a design", () => {
        const { body } = render(PageStructure, {
            props: {
                title: "Article title",
                ogDescription: "Article description",
                config: {
                    design: PageStructureDesignProbe,
                    mobileHeaderHeight: "32rem",
                    lgHeaderImageMinHeight: "64rem",
                    titleSize: "compact"
                }
            }
        });

        expect(body).toContain('data-mobile-header-height="32rem"');
        expect(body).toContain('data-desktop-header-min-height="64rem"');
        expect(body).toContain('data-title-size="compact"');
    });

    it("applies compact title typography without guessing from title length", () => {
        const { body } = render(PageStructureCinematicCover, {
            props: designProps({
                title: "A deliberately long translated page title",
                config: { ...config, titleSize: "compact" }
            })
        });

        expect(body).toContain("compact-title");
    });

    it.each(transitionCases)(
        "scopes $name transitions for the $layout layout",
        ({ Design, transitionDesign, layout }) => {
            const { body } = render(Design, {
                props: designProps({
                    config: { ...config, layout }
                })
            });

            const bannerName =
                layout === "content-only"
                    ? "none"
                    : `${transitionDesign}-banner-${layout}`;

            expect(body).toContain(`--banner-vt: ${bannerName}`);
            expect(body).toContain(
                `--title-vt: ${transitionDesign}-title-${layout}`
            );
            expect(body).toContain(
                `--content-vt: ${transitionDesign}-content-${layout}`
            );
        }
    );
});

describe("PageStructure back navigation", () => {
    it("forwards the complete back destination to the selected design", () => {
        const { body } = render(PageStructure, {
            props: {
                title: "Article title",
                ogDescription: "Article description",
                backTo,
                config: {
                    design: PageStructureDesignProbe,
                    layout: "content-only"
                }
            }
        });

        expect(body).toContain('href="/fr/news"');
        expect(body).toContain("Retour aux actualités");
    });

    it.each(designs)("renders the configured link in %s", (_name, Design) => {
        const { body } = render(Design, {
            props: designProps({ backTo })
        });

        expect(body).toContain('href="/fr/news"');
        expect(body).toContain("Retour aux actualités");
        expect(body).toContain('aria-hidden="true"');
    });

    it.each(designs)("omits the link in %s when unset", (_name, Design) => {
        const { body } = render(Design, {
            props: designProps()
        });

        expect(body).not.toContain('href="/fr/news"');
        expect(body).not.toContain("Retour aux actualités");
    });
});
