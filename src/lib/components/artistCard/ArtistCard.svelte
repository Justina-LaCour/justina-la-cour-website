<script lang="ts">
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import ArtistCardPortrait from "./designs/ArtistCardPortrait.svelte";
    import {
        createArtistCardPreview,
        type ArtistCardProps,
        type ArtistCardRenderContext
    } from "./artistCard";

    let {
        artist,
        class: className = "",
        children
    }: ArtistCardProps = $props();

    const i18n = useI18n();
    const preview = $derived<ArtistCardRenderContext>(
        createArtistCardPreview(
            artist,
            i18n.t("artists.website"),
            i18n.t("artists.readMore")
        )
    );
</script>

<article class="group {className}" data-artist-card>
    {#if children}
        {@render children(preview)}
    {:else}
        <ArtistCardPortrait {preview} />
    {/if}
</article>
