<script lang="ts">
    import { isPlayableRecording } from "$lib/artkyt/constants/externalPlatforms";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import { formatOptionalLocalizedDate } from "$lib/utils/dates";
    import { safeHttpHref } from "$lib/utils/urls";
    import CompositionItemDefault from "./designs/CompositionItemDefault.svelte";
    import type {
        CompositionItemProps,
        CompositionItemRenderContext
    } from "./compositionItem";

    let {
        composition,
        class: className = "border-b border-divider pb-12 last:border-0",
        children
    }: CompositionItemProps = $props();

    const i18n = useI18n();
    let premiereDate = $derived(
        formatOptionalLocalizedDate(composition.premiereDate, i18n.locale)
    );
    let buySheetHref = $derived(safeHttpHref(composition.buySheetUrl));
    let preview = $derived<CompositionItemRenderContext>({
        composition,
        premiereDate: premiereDate ?? undefined,
        premiereDetails: [
            premiereDate,
            composition.premiereLocation,
            composition.premierePerformers
        ].filter(Boolean).join(" · "),
        buySheetHref: buySheetHref ?? undefined,
        coverImageSrc: composition.coverImage?.highQualityUrl ?? composition.coverImage?.originalQualityUrl,
        playableRecordings: composition.recordings?.filter(isPlayableRecording) ?? [],
        labels: {
            premiere: i18n.t("compositions.premiere"),
            publisher: i18n.t("compositions.publisher"),
            buyScore: i18n.t("compositions.buyScore"),
            recordings: i18n.t("compositions.recordings")
        }
    });
</script>

<article class={className}>
    {#if children}
        {@render children(preview)}
    {:else}
        <CompositionItemDefault {preview} />
    {/if}
</article>
