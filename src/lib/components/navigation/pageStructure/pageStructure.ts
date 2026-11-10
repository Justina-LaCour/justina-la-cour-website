import type { LazyImageAsset } from "$lib/components/images/imageTypes";
import type { Component, Snippet } from "svelte";

export interface PageStructureDesignConfig {
    bannerImage?: LazyImageAsset;
    openGraphImage?: string;
    bannerPhotoCredits?: string;
    showBannerPhotoCredits?: boolean;
    bannerPosition: string;
    bannerMobilePosition: string;
    mobileHeaderHeight: string;
    lgHeaderImageMinHeight: string;
    titleSize: "default" | "compact";
    layout: "image-left" | "image-right" | "content-only";
}

export interface PageStructureBackTo {
    url: string;
    text: string;
}

export interface PageStructureDesignProps {
    title: string;
    subtitle?: string;
    backTo?: PageStructureBackTo;
    config: PageStructureDesignConfig;
    children?: Snippet;
    subtitleActions?: Snippet;
}

export type PageStructureDesign = Component<PageStructureDesignProps>;

export interface PageStructureConfig extends PageStructureDesignConfig {
    design: PageStructureDesign;
}

export interface PageStructureProps {
    title?: string;
    subtitle?: string;
    backTo?: PageStructureBackTo;
    config?: Partial<PageStructureConfig>;
    ogDescription: string;
    metadataTitle?: string;
    ogTitle?: string;
    ogImageUrl?: string;
    children?: Snippet;
    subtitleActions?: Snippet;
}
