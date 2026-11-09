import type { APIGallery, ArtkytImage } from "$lib/artkyt/types";
import type { GalleryImageItemRenderContext } from "$lib/components/galleryImageItem/galleryImageItem";
import type { Snippet } from "svelte";
import type { GalleryDensity } from "./Gallery.svelte";

export interface GalleryCollectionProps {
    galleries: readonly APIGallery[];
    onImageClick: (image: ArtkytImage) => void;
    class?: string;
    galleryClass?: string;
    imageItemClass?: string;
    density?: GalleryDensity;
    children?: Snippet<[GalleryImageItemRenderContext]>;
}
