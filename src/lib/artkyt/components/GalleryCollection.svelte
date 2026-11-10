<script lang="ts">
    import Gallery from "./Gallery.svelte";
    import type { GalleryCollectionProps } from "./galleryCollection";

    let {
        galleries,
        onImageClick,
        class: className = "",
        galleryClass = "",
        imageItemClass,
        density,
        children
    }: GalleryCollectionProps = $props();
</script>

{#if galleries.length > 0}
    <div class="space-y-16 {className}">
        {#each galleries as gallery (gallery.id)}
            <article class={galleryClass}>
                <Gallery
                    {gallery}
                    {onImageClick}
                    {imageItemClass}
                    {density}
                    {children}
                />
            </article>
        {/each}
    </div>
{/if}
