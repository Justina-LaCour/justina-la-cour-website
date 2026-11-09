import concertsPicture from "./concerts.jpeg?w=540;768;1080;1280;1536&quality=80&enhanced";
import concertsOpenGraphImage from "./concerts.jpeg?w=1200&h=630&fit=cover&position=center&format=jpg&quality=80";
import concertsPlaceholder from "./concerts.jpeg?w=48&format=webp&quality=35&inline";
import { PAGE_BANNER_SIZES, type PageBannerAsset } from "./types";

export const concertsBanner = {
    src: concertsPicture,
    lowresSrc: concertsPlaceholder,
    sizes: PAGE_BANNER_SIZES,
    openGraphSrc: concertsOpenGraphImage,
} satisfies PageBannerAsset;
