<script lang="ts">
    import { untrack } from "svelte";
    import type { PerformanceBookingInfo } from "$lib/artkyt/types";
    import BookingButtonRow, { type StrongButtonStyle } from "$lib/components/concert/BookingButtonRow.svelte";
    import type { ConcertPreviewRenderContext } from "$lib/components/concertPreviewItem/concertPreviewItem";
    import ConcertPreviewItemDefault from "$lib/components/concertPreviewItem/designs/ConcertPreviewItemDefault.svelte";
    import { I18n, provideI18n } from "$lib/i18n/i18n.svelte";
    import en from "$lib/translations/en";
    import fr from "$lib/translations/fr";

    let { performance, strongButtonStyle, locale = "fr", preview }: {
        performance: PerformanceBookingInfo;
        strongButtonStyle?: StrongButtonStyle;
        locale?: "fr" | "en";
        preview?: ConcertPreviewRenderContext;
    } = $props();

    provideI18n(new I18n({
        locale: untrack(() => locale),
        initialMessages: { fr, en }
    }));
</script>

{#if preview}
    <ConcertPreviewItemDefault {preview} />
{:else}
    <BookingButtonRow {performance} {strongButtonStyle} />
{/if}
