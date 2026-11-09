<script lang="ts">
    import ArtistCardImage from "../ArtistCardImage.svelte";
    import type { ArtistCardDesignProps } from "../artistCard";

    let { preview }: ArtistCardDesignProps = $props();
</script>

<div class="@container/artist-card">
    <div data-artist-card-design="nocturne" class="bg-primary-dark p-3 text-white shadow-lg @min-[40rem]/artist-card:p-5">
        <div class="grid border border-white/25 p-4 @min-[40rem]/artist-card:p-6 @min-[48rem]/artist-card:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.2fr)] @min-[48rem]/artist-card:gap-10">
            <ArtistCardImage
                {preview}
                class="relative aspect-4/5"
                imageClass="h-full w-full object-cover"
                sizes="(min-width: 1024px) 32vw, 100vw"
            />

            <div class="flex flex-col py-7 @min-[48rem]/artist-card:py-6 @min-[48rem]/artist-card:pr-6">
                {#if preview.artist.artisticRole}
                    <p class="text-xs font-bold tracking-[0.2em] uppercase text-white/65">
                        {preview.artist.artisticRole}
                    </p>
                {/if}
                <h2 class="mt-4 font-heading text-4xl leading-none text-white wrap-anywhere @min-[40rem]/artist-card:text-5xl">
                    {preview.artist.name}
                </h2>
                {#if preview.artist.bio}
                    <p class="mt-7 leading-relaxed text-white/75">
                        {preview.artist.bio}
                    </p>
                {/if}
                {#if preview.websiteHref}
                    <a
                        href={preview.websiteHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="mt-auto pt-8 font-bold text-white underline decoration-white/35 underline-offset-4 hover:decoration-white"
                    >
                        {preview.websiteLabel}
                    </a>
                {/if}
            </div>
        </div>
    </div>

</div>
