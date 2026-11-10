<script lang="ts">
    import type { APIGallery } from "$lib/artkyt/types";
    import { LogoGrid, type LogoGridItem } from "$lib/components/logoGrid";
    import { safeHttpHref } from "$lib/utils/urls";

    interface Props {
        id: string;
        title: string;
        galleries: readonly APIGallery[];
        class?: string;
    }

    let { id, title, galleries, class: className = "" }: Props = $props();

    const groups = $derived(galleries.map((gallery) => ({
        gallery,
        items: gallery.images.flatMap((image): LogoGridItem[] => {
            const imageUrl = safeHttpHref(image.highQualityUrl)
                ?? safeHttpHref(image.originalQualityUrl)
                ?? safeHttpHref(image.thumbnailUrl);
            return imageUrl ? [{
                name: image.credits.trim() || gallery.title,
                imageUrl
            }] : [];
        })
    })).filter(({ items }) => items.length > 0));
</script>

{#if groups.length > 0}
    <section class={className} aria-labelledby={id}>
        <h2 {id} class="mb-6 text-section-title">{title}</h2>
        {#each groups as { gallery, items } (gallery.id)}
            <LogoGrid {items} showLabels />
            {#if gallery.description.trim()}
                <p class="mt-4 whitespace-pre-wrap">{gallery.description}</p>
            {/if}
        {/each}
    </section>
{/if}
