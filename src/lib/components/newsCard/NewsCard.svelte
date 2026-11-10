<script lang="ts">
    import { resolve } from "$app/paths";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import { formatOptionalLocalizedDate } from "$lib/utils/dates";
    import { textExcerpt } from "$lib/utils/text";
    import NewsCardDefault from "./designs/NewsCardDefault.svelte";
    import type { NewsCardProps, NewsCardRenderContext } from "./newsCard";

    let {
        news,
        class: className = "group overflow-hidden rounded-sm border border-divider bg-background shadow-sm",
        children
    }: NewsCardProps = $props();

    const i18n = useI18n();
    let preview = $derived<NewsCardRenderContext>({
        news,
        href: resolve("/[lang]/news/[id]", {
            lang: i18n.locale,
            id: encodeURIComponent(news.id)
        }),
        publishedAt: formatOptionalLocalizedDate(news.publishedAt, i18n.locale) ?? undefined,
        imageSrc: news.image?.highQualityUrl ?? news.image?.originalQualityUrl,
        imageLowresSrc: news.image?.thumbnailUrl,
        excerpt: textExcerpt(news.content),
        readMoreLabel: i18n.t("news.readMore")
    });
</script>

<article class={className}>
    {#if children}
        {@render children(preview)}
    {:else}
        <NewsCardDefault {preview} />
    {/if}
</article>
