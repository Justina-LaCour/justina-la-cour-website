<script lang="ts">
    import LazyImage from "$lib/components/images/LazyImage.svelte";
    import type { NewsCardDesignProps } from "./newsCard";

    interface Props extends NewsCardDesignProps {
        class?: string;
        sizes?: string;
    }

    let {
        preview,
        class: className = "h-full w-full object-cover",
        sizes = "(min-width: 1000px) 30vw, (min-width: 640px) 40vw, 100vw"
    }: Props = $props();
</script>

{#if preview.imageSrc}
    <LazyImage
        src={preview.imageSrc}
        lowresSrc={preview.imageLowresSrc}
        {sizes}
        alt={preview.news.title}
        class={className}
    />
{:else}
    <div class="min-h-48 bg-linear-to-br from-primary-dark to-primary" aria-hidden="true"></div>
{/if}
