import type { PageStructureDesignConfig } from "./pageStructure";

export type PageStructureTransitionDesign =
    | "simple-two-columns"
    | "cinematic-cover"
    | "dark-gallery"
    | "floating-portrait"
    | "layered-poster";

export interface PageStructureTransitionNames {
    banner: string;
    title: string;
    content: string;
}

export function getPageStructureTransitionNames(
    design: PageStructureTransitionDesign,
    layout: PageStructureDesignConfig["layout"]
): PageStructureTransitionNames {
    return {
        banner: layout === "content-only" ? "none" : `${design}-banner-${layout}`,
        title: `${design}-title-${layout}`,
        content: `${design}-content-${layout}`
    };
}
