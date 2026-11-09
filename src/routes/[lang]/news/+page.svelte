<script lang="ts">
    import { artkytClient } from "$lib/artkyt";
    import type { Pagination } from "$lib/artkyt/types";
    import { newsBanner } from "$lib/assets/images/news";
    import NewsCard from "$lib/components/newsCard/NewsCard.svelte";
    import PaginatedList from "$lib/components/PaginatedList.svelte";
    import PageStructure from "$lib/components/navigation/pageStructure/PageStructure.svelte";
    import { useI18n } from "$lib/i18n/i18n.svelte";

    let { data } = $props();
    const i18n = useI18n();

    function loadMoreNews(pagination: Pagination) {
        return artkytClient.getNewsList({
            lang: data.lang,
            pagination
        });
    }
</script>

<PageStructure
    title={i18n.t("news.title")}
    ogDescription={i18n.t("og.newsDescription")}
    config={{ bannerImage: newsBanner, openGraphImage: newsBanner.openGraphSrc }}
>
    <PaginatedList
        initialData={data.news}
        loadMore={loadMoreNews}
        class="grid gap-8"
    >
        {#snippet children(news)}
            <NewsCard {news} />
        {/snippet}

        {#snippet empty()}
            <p class="m-0 text-muted">{i18n.t("news.empty")}</p>
        {/snippet}
    </PaginatedList>
</PageStructure>
