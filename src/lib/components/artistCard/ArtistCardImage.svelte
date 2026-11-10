<script lang="ts">
    import LazyImage from "$lib/components/images/LazyImage.svelte";
    import type { ArtistCardDesignProps } from "./artistCard";

    interface Props extends ArtistCardDesignProps {
        class?: string;
        imageClass?: string;
        initialsClass?: string;
        creditsClass?: string;
        sizes?: string;
    }

    let {
        preview,
        class: className = "",
        imageClass = "h-full w-full object-cover",
        initialsClass = "text-6xl",
        creditsClass = "right-2 bottom-2",
        sizes = "(min-width: 1024px) 40vw, 100vw"
    }: Props = $props();
</script>

<div class="overflow-hidden {className}">
    {#if preview.imageSrc}
        <LazyImage
            src={preview.imageSrc}
            lowresSrc={preview.imageLowresSrc}
            alt={preview.artist.name}
            {sizes}
            class={imageClass}
        />
    {:else}
        <div
            class="grid h-full min-h-48 place-items-center bg-linear-to-br from-primary-dark to-primary text-white/80"
            aria-hidden="true"
        >
            <span class="font-heading {initialsClass}">{preview.initials}</span>
        </div>
    {/if}

    {#if preview.artist.image?.credits}
        <span class="pointer-events-none absolute {creditsClass} z-10 max-w-[calc(100%-1rem)] wrap-anywhere rounded-full bg-black/65 px-2.5 py-1 text-xs text-white">
            © {preview.artist.image.credits}
        </span>
    {/if}
</div>
