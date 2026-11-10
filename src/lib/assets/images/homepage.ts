import type { LazyImageAsset } from "$lib/components/images/LazyImage.svelte";

import homepageDesktopPicture from "./homepage.jpg?w=768;1280;1920;2560;3200;3600&quality=90&enhanced";
import homepageOpenGraphImage from "./homepage-share.jpg";
import homepageDesktopPlaceholder from "./homepage.jpg?w=48&format=webp&quality=35&inline";
import homepageMobilePicture from "./homepage.jpg?w=640;960;1280;1600&aspect=2:3&position=center&quality=90&enhanced";
import homepageMobilePlaceholder from "./homepage.jpg?w=48&aspect=2:3&position=center&format=webp&quality=35&inline";

// object-fit: cover can scale by height rather than width. Account for the
// viewport height and the hero's 38.5rem minimum so DPR 2/3 screens get enough pixels.
const HOMEPAGE_MOBILE_SIZES = "max(100vw, 66.67vh, 25.67rem)";
const HOMEPAGE_DESKTOP_SIZES = "max(100vw, 150vh, 57.75rem)";

export const homepageHero: LazyImageAsset = {
    src: homepageMobilePicture,
    lowresSrc: homepageMobilePlaceholder,
    sizes: HOMEPAGE_MOBILE_SIZES,
    sources: [
        {
            media: "(min-width: 768px)",
            src: homepageDesktopPicture,
            lowresSrc: homepageDesktopPlaceholder,
            sizes: HOMEPAGE_DESKTOP_SIZES,
        },
    ],
};

export const homepageOpenGraphImageUrl = homepageOpenGraphImage;
