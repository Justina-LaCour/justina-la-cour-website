<script lang="ts">
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import RepertoireEntryItemDefault from "./designs/RepertoireEntryItemDefault.svelte";
    import type {
        RepertoireEntryItemProps,
        RepertoireEntryItemRenderContext
    } from "./repertoireEntryItem";

    let {
        entry,
        showPieceDuration,
        showPieceCatalogNumber,
        showPieceCompositionYear,
        class: className,
        children
    }: RepertoireEntryItemProps = $props();

    const i18n = useI18n();

    let details = $derived.by(() => {
        if (entry.type !== "piece") {
            return "";
        }

        const values: string[] = [];

        if (showPieceCatalogNumber && entry.catalogNumber) {
            values.push(`${i18n.t("repertoire.catalogNumber")}: ${entry.catalogNumber}`);
        }

        if (showPieceCompositionYear && entry.compositionYear !== undefined) {
            values.push(`${i18n.t("repertoire.compositionYear")}: ${entry.compositionYear}`);
        }

        return values.join(", ");
    });

    let duration = $derived(
        entry.durationMinutes !== undefined &&
            (entry.type === "intermission" || showPieceDuration)
            ? `${entry.durationMinutes} ${i18n.t("repertoire.minutes")}`
            : undefined
    );

    let preview = $derived<RepertoireEntryItemRenderContext>({
        entry,
        details,
        duration,
        intermissionLabel: entry.type === "intermission"
            ? entry.label || i18n.t("repertoire.intermission")
            : i18n.t("repertoire.intermission")
    });

    let resolvedClass = $derived(
        className ??
            (entry.type === "piece"
                ? "border-b border-divider py-5 first:pt-0"
                : "my-3 flex justify-between gap-4 border-l-[3px] border-control-border bg-black/[0.04] px-4 py-3 text-muted italic")
    );
</script>

<li class={resolvedClass}>
    {#if children}
        {@render children(preview)}
    {:else}
        <RepertoireEntryItemDefault {preview} />
    {/if}
</li>
