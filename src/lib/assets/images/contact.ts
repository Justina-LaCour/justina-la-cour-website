import contactPicture from "./contact.jpg?w=540;768;1080;1280;1536&quality=80&enhanced";
import contactOpenGraphImage from "./contact.jpg?w=1200&h=630&fit=cover&position=center&format=jpg&quality=80";
import contactPlaceholder from "./contact.jpg?w=48&format=webp&quality=35&inline";
import { PAGE_BANNER_SIZES, type PageBannerAsset } from "./types";

export const contactBanner = {
    src: contactPicture,
    lowresSrc: contactPlaceholder,
    sizes: PAGE_BANNER_SIZES,
    openGraphSrc: contactOpenGraphImage,
} satisfies PageBannerAsset;
