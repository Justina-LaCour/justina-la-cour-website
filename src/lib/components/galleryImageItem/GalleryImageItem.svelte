<script lang="ts">
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import GalleryImageItemSoftFocus from "./designs/GalleryImageItemSoftFocus.svelte";
    import type {
        GalleryImageItemProps,
        GalleryImageItemRenderContext
    } from "./galleryImageItem";

    let {
        image,
        onImageClick,
        class: className = "rounded-4xl",
        children
    }: GalleryImageItemProps = $props();

    const i18n = useI18n();
    let preview = $derived<GalleryImageItemRenderContext>({
        image,
        src: image.thumbnailUrl ?? image.highQualityUrl ?? image.originalQualityUrl,
        credit: image.credits
    });
</script>

<button
    type="button"
    class="group relative block aspect-square overflow-hidden text-left {className}"
    aria-label={i18n.t("gallery.openImage")}
    onclick={() => onImageClick(image)}
>
    {#if children}
        {@render children(preview)}
    {:else}
        <GalleryImageItemSoftFocus {preview} />
    {/if}
</button>
