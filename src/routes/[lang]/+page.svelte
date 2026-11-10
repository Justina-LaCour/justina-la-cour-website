<script lang="ts">
    import { resolve } from "$app/paths";
    import RecordingPlayer from "$lib/artkyt/components/RecordingPlayer.svelte";
    import { homepageHero, homepageOpenGraphImageUrl } from "$lib/assets/images/homepage";
    import { mediaBanner } from "$lib/assets/images/media";
    import ConcertPreviewItem from "$lib/components/concertPreviewItem/ConcertPreviewItem.svelte";
    import SimpleHero from "$lib/components/homepage/SimpleHero.svelte";
    import LazyImage from "$lib/components/images/LazyImage.svelte";
    import NewsCardNewspaperColumn from "$lib/components/newsCard/designs/NewsCardNewspaperColumn.svelte";
    import NewsCard from "$lib/components/newsCard/NewsCard.svelte";
    import OpenGraph from "$lib/components/utils/OpenGraph.svelte";
    import { site } from "$lib/config/config";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
    const i18n = useI18n();
    let params = $derived({ lang: data.lang });
</script>

<OpenGraph
    title={site.identity.name}
    description={i18n.t("og.homeDescription")}
    imageUrl={homepageOpenGraphImageUrl}
    imageAlt={i18n.t("og.homeImageAlt")}
/>

<main id="main-content" tabindex="-1">
    <SimpleHero title={site.identity.name} tagline={i18n.t("home.tagline")} image={homepageHero} />

    <div class="bg-background">
        <div class="mx-auto max-w-6xl space-y-14 px-5 py-12 sm:px-8 lg:space-y-20 lg:py-20">
            <div class="grid gap-8 md:grid-cols-2 md:items-center">
                <section>
                    <h2>{i18n.t("home.about")}</h2>
                    {#if data.bioExcerpt}
                        <p class="mb-5 max-w-prose">{data.bioExcerpt}</p>
                    {/if}
                    <a class="section-link" href={resolve("/[lang]/bio", params)}>
                        {i18n.t("home.seeBio")}
                    </a>
                </section>
                <section aria-label={i18n.t("home.featuredRecording")}>
                    <RecordingPlayer
                        platform="youtube"
                        url="https://youtu.be/znK4PkjvpQc"
                        iframeClass="block aspect-video h-auto"
                    />
                </section>
            </div>

            <section class="border-t border-divider pt-8">
                <h2>{i18n.t("home.latestNews")}</h2>
                {#if data.latestNews.length}
                    <div class="mb-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {#each data.latestNews as news (news.id)}
                            <NewsCard {news} class="group">
                                {#snippet children(preview)}
                                    <NewsCardNewspaperColumn {preview} />
                                {/snippet}
                            </NewsCard>
                        {/each}
                    </div>
                {:else}
                    <p class="mb-5 text-muted">{i18n.t("news.empty")}</p>
                {/if}
                <a class="section-link" href={resolve("/[lang]/news", params)}>
                    {i18n.t("home.seeNews")}
                </a>
            </section>

            <section class="border-t border-divider pt-8">
                <h2>{i18n.t("home.upcomingConcerts")}</h2>
                {#if data.upcomingConcerts.length}
                    <div class="mb-5 grid gap-4">
                        {#each data.upcomingConcerts as concert}
                            <ConcertPreviewItem
                                {concert}
                                linkFormatter={(concert) => concert.url || null}
                                bookingUrlLabel={i18n.t("home.concertInfoAndTickets")}
                            />
                        {/each}
                    </div>
                {:else}
                    <p class="mb-5 text-muted">{i18n.t("concerts.upcomingEmpty")}</p>
                {/if}
                <a class="section-link" href={resolve("/[lang]/concerts", params)}>
                    {i18n.t("home.seeConcerts")}
                </a>
            </section>
        </div>
    </div>
</main>

<style>
    h2 {
        margin-bottom: 1rem;
        color: var(--color-primary-dark);
        font: var(--text-section-title--font-weight)
            var(--text-section-title) / var(--text-section-title--line-height)
            var(--font-heading);
    }

    .section-link {
        color: var(--color-primary);
        font-weight: 600;
        text-decoration: underline;
        text-underline-offset: 0.25em;
    }
</style>
