<script lang="ts">
    import LazyImage from "$lib/components/images/LazyImage.svelte";
    import type { LazyImageAsset } from "$lib/components/images/LazyImage.svelte";

    interface Props {
        image: LazyImageAsset;
        photoCredits?: string;
        position: string;
        mobilePosition: string;
        class?: string;
    }

    let {
        image,
        photoCredits,
        position,
        mobilePosition,
        class: className = ""
    }: Props = $props();
</script>

<figure
    class="page-structure-banner {className}"
    style="--banner-position: {position}; --banner-mobile-position: {mobilePosition};"
>
    <LazyImage
        src={image.src}
        lowresSrc={image.lowresSrc}
        lowresFilter={image.lowresFilter}
        sources={image.sources}
        sizes={image.sizes}
        alt=""
        loading="eager"
        fetchpriority="high"
    />
    {#if photoCredits}
        <figcaption>© {photoCredits}</figcaption>
    {/if}
</figure>

<style>
    figure {
        position: relative;
        margin: 0;
        overflow: hidden;
    }

    figure :global(.lazy-image) {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: var(--banner-mobile-position);
    }

    figcaption {
        box-sizing: border-box;
        position: absolute;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 100%;
        padding: 4rem clamp(0.75rem, 3vw, 1rem) 1rem;
        background: linear-gradient(to top, rgb(0 0 0 / 0.72), transparent);
        color: white;
        font-size: 0.8rem;
        overflow-wrap: anywhere;
        text-align: right;
    }

    @media screen and (width > 1024px) {
        figure :global(.lazy-image) {
            object-position: var(--banner-position);
        }
    }
</style>
