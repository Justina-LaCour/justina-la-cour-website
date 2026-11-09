<script lang="ts">
    import ArtistCardImage from "../ArtistCardImage.svelte";
    import type { ArtistCardDesignProps } from "../artistCard";

    let { preview }: ArtistCardDesignProps = $props();
</script>

<div class="@container/artist-card">
    <div data-artist-card-design="medallion" class="mx-auto max-w-3xl border-y border-primary-dark/20 px-5 py-10 text-center @min-[40rem]/artist-card:px-12 @min-[40rem]/artist-card:py-14">
        <ArtistCardImage
            {preview}
            class="relative mx-auto aspect-square w-48 rounded-full ring-8 ring-primary-dark/5 @min-[40rem]/artist-card:w-64"
            imageClass="h-full w-full object-cover"
            initialsClass="text-5xl"
            creditsClass="bottom-6 left-1/2 -translate-x-1/2 w-max max-w-[70%] text-center"
            sizes="(min-width: 640px) 16rem, 12rem"
        />

        {#if preview.artist.artisticRole}
            <p class="mt-8 text-xs font-bold tracking-[0.22em] uppercase text-primary">
                {preview.artist.artisticRole}
            </p>
        {/if}
        <h2 class="mt-3 font-heading text-4xl leading-tight text-primary-dark wrap-anywhere @min-[40rem]/artist-card:text-5xl">
            {preview.artist.name}
        </h2>
        {#if preview.artist.bio}
            <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                {preview.artist.bio}
            </p>
        {/if}
        {#if preview.websiteHref}
            <a
                href={preview.websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                class="transition-ui reduce-motion mt-8 inline-flex rounded-full border border-primary-dark px-5 py-2.5 text-sm font-bold text-primary-dark hover:bg-primary-dark hover:text-white"
            >
                {preview.websiteLabel}
            </a>
        {/if}
    </div>

</div>
