<script lang="ts">
    import {
        formatPerformanceDateRange,
        formatPerformanceDateTimeAttribute
    } from "$lib/artkyt/concerts";
    import type { APIConcert } from "$lib/artkyt/types";
    import RichText from "$lib/components/content/RichText.svelte";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import { safeHttpHref } from "$lib/utils/urls";
    import PerformanceBooking from "./PerformanceBooking.svelte";

    interface Props {
        concert: APIConcert;
        descriptionHtml?: string;
        class?: string;
    }

    let {
        concert,
        descriptionHtml,
        class: className = ""
    }: Props = $props();
    const i18n = useI18n();

    let performances = $derived(
        concert.performances.map((performance) => ({
            performance,
            formattedDate: formatPerformanceDateRange(
                i18n.locale,
                performance
            ),
            dateTime: formatPerformanceDateTimeAttribute(performance)
        }))
    );
    let plainDescription = $derived(
        concert.longDescription || concert.shortDescription
    );
    let externalHref = $derived(safeHttpHref(concert.url));
</script>

<article class={`space-y-8 ${className}`.trim()}>
    <div>
        <h2 class="text-section-title text-primary-dark">{concert.title}</h2>

        {#if performances.length > 0}
            <div class="mt-4 space-y-6">
                {#each performances as item (item.performance.id)}
                    <div>
                        {#if item.formattedDate && item.dateTime}
                            <h3 class="text-xl leading-relaxed m-0">
                                <time datetime={item.dateTime}>
                                    {item.formattedDate}
                                </time>
                            </h3>
                        {/if}
                        <h3 class="text-xl leading-relaxed">
                            {item.performance.venueName}
                        </h3>

                        <PerformanceBooking performance={item.performance} />
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    {#if descriptionHtml !== undefined}
        <RichText sanitizedHtml={descriptionHtml} />
    {:else if plainDescription}
        <div
            class="concert-description prose max-w-none whitespace-pre-wrap text-foreground"
        >
            {plainDescription}
        </div>
    {/if}

    {#if externalHref}
        <a
            class="transition-ui reduce-motion inline-flex rounded-full border border-primary-dark bg-primary-dark px-5 py-2 font-semibold text-white hover:bg-background hover:text-primary-dark"
            href={externalHref}
            target="_blank"
            rel="noopener noreferrer"
        >
            {i18n.t("concerts.moreInformation")}
        </a>
    {/if}
</article>
