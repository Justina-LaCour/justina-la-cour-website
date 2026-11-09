<script lang="ts">
    import type { APINewsItem } from "$lib/artkyt/types";
    import LazyImage from "$lib/components/images/LazyImage.svelte";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import { formatOptionalLocalizedDate } from "$lib/utils/dates";

    interface Props {
        news: APINewsItem;
        showPhotoCredits?: boolean;
    }

    let { news, showPhotoCredits = true }: Props = $props();
    const i18n = useI18n();

    let publishedAt = $derived(
        formatOptionalLocalizedDate(news.publishedAt, i18n.locale)
    );
    let imageSrc = $derived(
        news.image?.highQualityUrl ?? news.image?.originalQualityUrl
    );
</script>

<article class="mx-auto max-w-4xl">
    {#if publishedAt}
        <time class="block text-sm text-muted" datetime={news.publishedAt}>
            {publishedAt}
        </time>
    {/if}

    {#if imageSrc}
        <figure class="my-8">
            <LazyImage
                src={imageSrc}
                lowresSrc={news.image?.thumbnailUrl}
                sizes="(min-width: 900px) 800px, 100vw"
                alt={news.title}
                class="max-h-144 w-full bg-primary-dark/10 object-cover"
            />
            {#if showPhotoCredits && news.image?.credits}
                <figcaption class="mt-2 text-right text-xs text-muted">
                    © {news.image.credits}
                </figcaption>
            {/if}
        </figure>
    {/if}

    <div class="whitespace-pre-wrap text-lg leading-relaxed">
        {news.content}
    </div>
</article>
