<script lang="ts">
    import ArtistCardImage from "../ArtistCardImage.svelte";
    import type { ArtistCardDesignProps } from "../artistCard";

    let { preview }: ArtistCardDesignProps = $props();
</script>

<div class="@container/artist-card">
    <div data-artist-card-design="cinematic" class="relative isolate min-h-144 overflow-hidden rounded-sm bg-primary-dark text-white shadow-xl">
        <ArtistCardImage
            {preview}
            class="absolute inset-0 h-full w-full"
            imageClass="transition-panel reduce-motion h-full w-full object-cover group-hover:scale-[1.02]"
            initialsClass="text-8xl"
            sizes="(min-width: 1024px) 72rem, 100vw"
        />
        <div class="absolute inset-0 bg-linear-to-t from-black via-black/45 to-black/5" aria-hidden="true"></div>

        <div class="relative flex min-h-144 flex-col justify-end p-6 @min-[40rem]/artist-card:p-10 @min-[64rem]/artist-card:p-14">
            {#if preview.artist.artisticRole}
                <p class="text-xs font-bold tracking-[0.2em] uppercase text-white/75">
                    {preview.artist.artisticRole}
                </p>
            {/if}
            <h2 class="mt-3 max-w-4xl font-heading text-4xl leading-none text-white wrap-anywhere @min-[40rem]/artist-card:text-6xl">
                {preview.artist.name}
            </h2>
            {#if preview.artist.bio}
                <p class="mt-5 max-w-3xl line-clamp-4 text-base leading-relaxed text-white/80 @min-[40rem]/artist-card:text-lg">
                    {preview.artist.bio}
                </p>
            {/if}
            {#if preview.websiteHref}
                <a
                    href={preview.websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-7 w-fit font-bold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
                >
                    {preview.websiteLabel}<span aria-hidden="true"> ↗</span>
                </a>
            {/if}
        </div>
    </div>

</div>
