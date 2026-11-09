import bioPicture from "./bio.jpeg?w=540;768;1080;1280;1440&quality=80&enhanced";
import bioOpenGraphImage from "./bio.jpeg?w=1200&h=630&fit=cover&position=center&format=jpg&quality=80";
import bioPlaceholder from "./bio.jpeg?w=48&format=webp&quality=35&inline";
import { PAGE_BANNER_SIZES, type PageBannerAsset } from "./types";

export const bioBanner = {
    src: bioPicture,
    lowresSrc: bioPlaceholder,
    sizes: PAGE_BANNER_SIZES,
    openGraphSrc: bioOpenGraphImage,
} satisfies PageBannerAsset;
