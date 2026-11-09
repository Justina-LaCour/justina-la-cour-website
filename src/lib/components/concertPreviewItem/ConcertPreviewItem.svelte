<script lang="ts">
    import {
        formatPerformanceDateRange,
        formatPerformanceDateTimeAttribute
    } from "$lib/artkyt/concerts";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import { safeHttpHref } from "$lib/utils/urls";
    import ConcertPreviewItemDefault from "./designs/ConcertPreviewItemDefault.svelte";
    import type {
        ConcertPreviewItemProps,
        ConcertPreviewLink,
        ConcertPreviewRenderContext
    } from "./concertPreviewItem";

    let {
        concert,
        linkFormatter,
        newTab = false,
        class: className = "",
        children
    }: ConcertPreviewItemProps = $props();

    const i18n = useI18n();
    let firstPerformance = $derived(concert.performances[0]);
    let formattedDate = $derived(
        firstPerformance
            ? formatPerformanceDateRange(i18n.locale, firstPerformance)
            : null
    );
    let moreInfoHref = $derived(safeHttpHref(linkFormatter(concert)));
    let performanceDateTime = $derived(
        firstPerformance
            ? formatPerformanceDateTimeAttribute(firstPerformance)
            : null
    );
    let link = $derived<ConcertPreviewLink | undefined>(
        moreInfoHref
            ? {
                href: moreInfoHref,
                label: i18n.t("concerts.moreInformation"),
                target: newTab ? "_blank" : undefined,
                rel: newTab ? "noopener noreferrer" : undefined
            }
            : undefined
    );
    let renderContext = $derived<ConcertPreviewRenderContext | undefined>(
        firstPerformance && formattedDate && performanceDateTime
            ? {
                concert,
                performance: firstPerformance,
                formattedDate,
                performanceDateTime,
                link
            }
            : undefined
    );
</script>

{#if renderContext}
    <article class={className}>
        {#if children}
            {@render children(renderContext)}
        {:else}
            <ConcertPreviewItemDefault preview={renderContext} />
        {/if}
    </article>
{/if}
