import type { ArtkytImage } from "$lib/artkyt/types";
import type { Snippet } from "svelte";

export interface GalleryImageItemRenderContext {
    image: ArtkytImage;
    src: string;
    credit: string;
}

export interface GalleryImageItemProps {
    image: ArtkytImage;
    onImageClick: (image: ArtkytImage) => void;
    class?: string;
    children?: Snippet<[GalleryImageItemRenderContext]>;
}

export interface GalleryImageItemDesignProps {
    preview: GalleryImageItemRenderContext;
}
