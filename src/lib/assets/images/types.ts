import type { LazyImageAsset } from "$lib/components/images/LazyImage.svelte";

export interface PageBannerAsset extends LazyImageAsset {
    openGraphSrc: string;
}

// The 2:3 source covers the 100vw × 28rem mobile container by width:
// at the 320px minimum viewport, 320 / 448 remains greater than 2 / 3.
export const PAGE_BANNER_SIZES =
    "(min-width: 1201px) min(40rem, 50vw), 100vw";
