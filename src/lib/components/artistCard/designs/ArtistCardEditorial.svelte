<script lang="ts">
    import ArtistCardImage from "../ArtistCardImage.svelte";
    import type { ArtistCardDesignProps } from "../artistCard";

    let { preview }: ArtistCardDesignProps = $props();
</script>

<div class="@container/artist-card">
    <div data-artist-card-design="editorial" class="grid overflow-hidden border-t-4 border-primary-dark bg-background @min-[48rem]/artist-card:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
        <div class="flex flex-col px-1 py-8 @min-[48rem]/artist-card:order-1 @min-[48rem]/artist-card:p-10 @min-[48rem]/artist-card:pl-0">
            {#if preview.artist.artisticRole}
                <p class="text-xs font-bold tracking-[0.2em] uppercase text-primary">
                    {preview.artist.artisticRole}
                </p>
            {/if}
            <h2 class="mt-4 max-w-3xl font-heading text-4xl leading-none text-primary-dark wrap-anywhere @min-[40rem]/artist-card:text-5xl">
                {preview.artist.name}
            </h2>
            {#if preview.artist.bio}
                <p class="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
                    {preview.artist.bio}
                </p>
            {/if}
            {#if preview.websiteHref}
                <a
                    href={preview.websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-auto pt-8 font-bold text-primary hover:underline"
                >
                    {preview.websiteLabel} <span aria-hidden="true">→</span>
                </a>
            {/if}
        </div>

        <ArtistCardImage
            {preview}
            class="relative aspect-4/3 min-h-72 @min-[48rem]/artist-card:order-2 @min-[48rem]/artist-card:aspect-auto @min-[48rem]/artist-card:min-h-full"
            imageClass="h-full w-full object-cover"
            sizes="(min-width: 1024px) 35vw, 100vw"
        />
    </div>

</div>
