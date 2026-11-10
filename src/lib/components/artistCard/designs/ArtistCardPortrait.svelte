<script lang="ts">
    import ArtistCardImage from "../ArtistCardImage.svelte";
    import type { ArtistCardDesignProps } from "../artistCard";

    let { preview }: ArtistCardDesignProps = $props();
</script>

<div class="@container/artist-card">
    <div data-artist-card-design="portrait" class="mx-auto flex max-w-xl flex-col overflow-hidden rounded-sm border border-divider bg-background shadow-sm">
        <ArtistCardImage
            {preview}
            class="relative aspect-4/5"
            imageClass="transition-panel reduce-motion h-full w-full object-cover group-hover:scale-[1.015]"
            sizes="(min-width: 640px) 36rem, 100vw"
        />

        <div class="flex flex-1 flex-col p-6 @min-[40rem]/artist-card:p-8">
            <h2 class="font-heading text-3xl leading-tight text-primary-dark">
                {preview.artist.name}
            </h2>
            {#if preview.artist.artisticRole}
                <p class="mt-2 text-sm font-semibold tracking-[0.12em] uppercase text-primary">
                    {preview.artist.artisticRole}
                </p>
            {/if}
            {#if preview.artist.bio}
                <p class="mt-5 leading-relaxed text-muted">{preview.artist.bio}</p>
            {/if}
            {#if preview.websiteHref}
                <a
                    href={preview.websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="transition-ui reduce-motion mt-auto pt-6 font-semibold text-primary hover:underline"
                >
                    {preview.websiteLabel}<span aria-hidden="true"> ↗</span>
                </a>
            {/if}
        </div>
    </div>

</div>
