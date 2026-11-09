<script module lang="ts">
    export type GalleryDensity = "compact" | "comfortable";
</script>

<script lang="ts">
    import GalleryImageItem from "$lib/components/galleryImageItem/GalleryImageItem.svelte";
    import type { GalleryImageItemRenderContext } from "$lib/components/galleryImageItem/galleryImageItem";
    import type { Snippet } from "svelte";
    import type { APIGallery, ArtkytImage } from "../types";

    interface Props {
        gallery: APIGallery;
        onImageClick: (image: ArtkytImage) => void;
        imageItemClass?: string;
        density?: GalleryDensity;
        children?: Snippet<[GalleryImageItemRenderContext]>;
    }

    let {
        gallery,
        onImageClick,
        imageItemClass,
        density = "compact",
        children
    }: Props = $props();
</script>

<h2 class="text-section-title">{gallery.title}</h2>
<div class="max-w-none my-4">{gallery.description}</div>

<div
    class="gallery-grid {density} grid gap-4"
    style="grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--gallery-min-width)), 1fr));"
>
    {#each gallery.images as image}
        <GalleryImageItem
            {image}
            {onImageClick}
            class={imageItemClass}
            {children}
        />
    {/each}
</div>

<style>
    .compact {
        --gallery-min-width: 200px;
    }

    .comfortable {
        --gallery-min-width: 300px;
    }
</style>
