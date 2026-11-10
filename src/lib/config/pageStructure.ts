import PageStructureSimpleTwoColumns from "$lib/components/navigation/pageStructure/designs/PageStructureSimpleTwoColumns.svelte";
import type { PageStructureConfig } from "$lib/components/navigation/pageStructure/pageStructure";

export const defaultPageStructureConfig: PageStructureConfig = {
    design: PageStructureSimpleTwoColumns,
    bannerImage: undefined,
    openGraphImage: undefined,
    bannerPhotoCredits: undefined,
    bannerPosition: "center center",
    bannerMobilePosition: "center center",
    mobileHeaderHeight: "28rem",
    lgHeaderImageMinHeight: "55rem",
    titleSize: "default",
    layout: "image-right"
};
