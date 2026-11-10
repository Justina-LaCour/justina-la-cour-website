import type { Picture } from "@sveltejs/enhanced-img";

export type LazyImageInput = string | Picture;

export interface LazyImageSource {
    media?: string;
    type?: string;
    src: LazyImageInput;
    lowresSrc?: string;
    sizes?: string;
}

export interface LazyImageAsset {
    src: LazyImageInput;
    lowresSrc?: string;
    lowresFilter?: string;
    sources?: readonly LazyImageSource[];
    sizes?: string;
}
