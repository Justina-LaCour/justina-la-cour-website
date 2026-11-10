<script lang="ts">
    import NewsCardImage from "../NewsCardImage.svelte";
    import type { NewsCardDesignProps } from "../newsCard";

    let { preview }: NewsCardDesignProps = $props();
</script>

<a class="grid h-full sm:min-h-80 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]" href={preview.href}>
    <div class="grid aspect-4/3 overflow-hidden bg-primary-dark/10 sm:aspect-auto sm:contain-size">
        <NewsCardImage {preview} class="h-full w-full object-cover" />
    </div>

    <div class="flex flex-col p-6 wrap-anywhere">
        {#if preview.publishedAt}
            <time class="mb-3 text-sm text-muted" datetime={preview.news.publishedAt}>
                {preview.publishedAt}
            </time>
        {/if}
        <h2 class="text-subsection-title text-primary-dark">{preview.news.title}</h2>
        {#if preview.excerpt}
            <p class="mt-3 text-black/75">{preview.excerpt}</p>
        {/if}
        <span class="transition-ui reduce-motion mt-auto pt-6 font-semibold text-primary group-hover:underline">
            {preview.readMoreLabel}
        </span>
    </div>
</a>
