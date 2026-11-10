<script lang="ts">
    import { artkytClient } from "$lib/artkyt";
    import {
        comparePerformanceDates,
        hasRenderablePerformance,
        performanceMonthKey
    } from "$lib/artkyt/concerts";
    import { concertsBanner } from "$lib/assets/images/concerts";
    import {
        pastConcertsFilter,
        upcomingConcertsFilter,
        type APIConcertPreview,
        type Pagination
    } from "$lib/artkyt/types";
    import ConcertPreviewItem from "$lib/components/concertPreviewItem/ConcertPreviewItem.svelte";
    import PaginatedList from "$lib/components/PaginatedList.svelte";
    import PageStructure from "$lib/components/navigation/pageStructure/PageStructure.svelte";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import { groupBy } from "$lib/utils/array";

    let { data } = $props();
    const i18n = useI18n();
    let monthFormatter = $derived(
        new Intl.DateTimeFormat(data.lang, {
            month: "long",
            year: "numeric"
        })
    );

    function concertLinkFormatter(concert: APIConcertPreview): string | null {
        return concert.url || null;
    }

    function sortUpcoming(a: APIConcertPreview, b: APIConcertPreview): number {
        return comparePerformanceDates(a, b, "asc");
    }

    function sortPast(a: APIConcertPreview, b: APIConcertPreview): number {
        return comparePerformanceDates(a, b, "desc");
    }

    function groupByMonth(concerts: APIConcertPreview[]) {
        return groupBy(concerts, (concert) => {
            return performanceMonthKey(concert) ?? "unknown";
        });
    }

    function formatMonthGroupKey(groupKey: string): string {
        const [year, month] = groupKey.split("-").map(Number);
        const date = new Date(0);
        date.setFullYear(year, month - 1, 1);
        date.setHours(0, 0, 0, 0);
        return monthFormatter.format(date);
    }

    function loadMoreUpcoming(pagination: Pagination) {
        return artkytClient.getConcertsList({
            lang: data.lang,
            filter: upcomingConcertsFilter(),
            pagination
        });
    }

    function loadMorePast(pagination: Pagination) {
        return artkytClient.getConcertsList({
            lang: data.lang,
            filter: pastConcertsFilter(),
            pagination
        });
    }
</script>

<PageStructure
    title={i18n.t("concerts.title")}
    ogDescription={i18n.t("og.concertsDescription")}
    config={{
        bannerImage: concertsBanner,
        openGraphImage: concertsBanner.openGraphSrc,
        bannerPosition: "4% 50%",
        bannerMobilePosition: "4% 20%"
    }}
>
    <div class="space-y-16">
        <section>
            <h2 class="mb-8 text-section-title">
                {i18n.t("home.upcomingConcerts")}
            </h2>
            <PaginatedList
                initialData={data.upcoming}
                loadMore={loadMoreUpcoming}
                filter={hasRenderablePerformance}
                sort={sortUpcoming}
                group={groupByMonth}
                class="divide-y divide-divider"
            >
                {#snippet groupHeader(groupKey)}
                    <h3 class="mb-5 text-subsection-title capitalize text-primary-dark">
                        {formatMonthGroupKey(groupKey)}
                    </h3>
                {/snippet}
                {#snippet children(concert)}
                    <ConcertPreviewItem
                        {concert}
                        linkFormatter={concertLinkFormatter}
                        newTab={true}
                    />
                {/snippet}
                {#snippet empty()}
                    <p class="m-0 text-muted">
                        {i18n.t("concerts.upcomingEmpty")}
                    </p>
                {/snippet}
            </PaginatedList>
        </section>

        <hr class="my-8 border-divider" />

        <section>
            <h2 class="mb-8 text-section-title">
                {i18n.t("concerts.pastTitle")}
            </h2>
            <PaginatedList
                initialData={data.past}
                loadMore={loadMorePast}
                filter={hasRenderablePerformance}
                sort={sortPast}
                group={groupByMonth}
                class="divide-y divide-divider"
            >
                {#snippet groupHeader(groupKey)}
                    <h3 class="mb-5 text-subsection-title capitalize text-primary-dark">
                        {formatMonthGroupKey(groupKey)}
                    </h3>
                {/snippet}
                {#snippet children(concert)}
                    <ConcertPreviewItem
                        {concert}
                        linkFormatter={concertLinkFormatter}
                        newTab={true}
                    />
                {/snippet}
                {#snippet empty()}
                    <p class="m-0 text-muted">
                        {i18n.t("concerts.pastEmpty")}
                    </p>
                {/snippet}
            </PaginatedList>
        </section>
    </div>
</PageStructure>
