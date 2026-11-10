<script lang="ts">
    import { resolve } from "$app/paths";
    import { newsBanner } from "$lib/assets/images/news";
    import NewsArticle from "$lib/components/news/NewsArticle.svelte";
    import PageStructure from "$lib/components/navigation/pageStructure/PageStructure.svelte";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import { textExcerpt } from "$lib/utils/text";

    let { data } = $props();
    const i18n = useI18n();

    let openGraphImage = $derived(
        data.news.image?.highQualityUrl ?? data.news.image?.originalQualityUrl ?? newsBanner.openGraphSrc
    );
</script>

<PageStructure
    title={data.news.title}
    ogDescription={textExcerpt(data.news.content)}
    ogImageUrl={openGraphImage}
    backTo={{
        url: resolve("/[lang]/news", { lang: i18n.locale }),
        text: i18n.t("news.backToList")
    }}
    config={{ layout: "content-only" }}
>
    <NewsArticle news={data.news} />
</PageStructure>
