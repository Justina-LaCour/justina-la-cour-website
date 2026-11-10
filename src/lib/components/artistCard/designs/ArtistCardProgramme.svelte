<script lang="ts">
    import ArtistCardImage from "../ArtistCardImage.svelte";
    import type { ArtistCardDesignProps } from "../artistCard";

    let { preview }: ArtistCardDesignProps = $props();
</script>

<div class="@container/artist-card">
    <div data-artist-card-design="programme" class="grid grid-cols-[7rem_minmax(0,1fr)] gap-5 border-b border-primary-dark/25 py-5 @min-[40rem]/artist-card:grid-cols-[10rem_minmax(0,1fr)_auto] @min-[40rem]/artist-card:items-center @min-[40rem]/artist-card:gap-8">
        <ArtistCardImage
            {preview}
            class="relative aspect-square"
            imageClass="h-full w-full object-cover"
            initialsClass="text-3xl"
            sizes="(min-width: 640px) 10rem, 7rem"
        />

        <div class="min-w-0">
            {#if preview.artist.artisticRole}
                <p class="text-xs font-bold tracking-[0.18em] uppercase text-primary">
                    {preview.artist.artisticRole}
                </p>
            {/if}
            <h2 class="mt-1 font-heading text-2xl leading-tight text-primary-dark wrap-anywhere @min-[40rem]/artist-card:text-3xl">
                {preview.artist.name}
            </h2>
            {#if preview.artist.bio}
                <p class="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                    {preview.artist.bio}
                </p>
            {/if}
        </div>

        {#if preview.websiteHref}
            <a
                href={preview.websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                class="transition-ui reduce-motion col-start-2 inline-flex size-12 items-center justify-center justify-self-start rounded-full border border-primary-dark text-xl text-primary-dark hover:bg-primary-dark hover:text-white @min-[40rem]/artist-card:col-start-3 @min-[40rem]/artist-card:row-start-1 @min-[40rem]/artist-card:justify-self-end"
            >
                <span class="sr-only">{preview.websiteLabel}</span>
                <span aria-hidden="true">↗</span>
            </a>
        {/if}
    </div>

</div>
