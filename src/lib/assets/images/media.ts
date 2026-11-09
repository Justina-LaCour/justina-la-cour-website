import mediaPicture from "./media.jpg?w=480;720;960&quality=80&enhanced";
import mediaOpenGraphImage from "./media.jpg?w=960&h=504&fit=cover&position=center&format=jpg&quality=80";
import mediaPlaceholder from "./media.jpg?w=48&format=webp&quality=35&inline";
import { PAGE_BANNER_SIZES, type PageBannerAsset } from "./types";

export const mediaBanner = {
    src: mediaPicture,
    lowresSrc: mediaPlaceholder,
    sizes: PAGE_BANNER_SIZES,
    openGraphSrc: mediaOpenGraphImage
} satisfies PageBannerAsset;
