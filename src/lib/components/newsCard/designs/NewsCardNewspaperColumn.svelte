<script lang="ts">
    import NewsCardImage from "../NewsCardImage.svelte";
    import type { NewsCardDesignProps } from "../newsCard";

    let { preview }: NewsCardDesignProps = $props();
</script>

<a class="flex h-full flex-col" href={preview.href}>
    <div class="grid aspect-3/2 grid-rows-[minmax(0,1fr)] overflow-hidden">
        <NewsCardImage {preview} class="h-full w-full object-cover" />
    </div>
    {#if preview.publishedAt}
        <time class="mt-5 block text-xs font-bold tracking-[0.2em] uppercase text-muted" datetime={preview.news.publishedAt}>
            {preview.publishedAt}
        </time>
    {/if}
    <h2 class="mt-3 font-heading text-subsection-title text-primary-dark wrap-anywhere group-hover:text-primary group-focus-within:text-primary">
        {preview.news.title}
    </h2>
    <p class="mt-3 text-sm leading-relaxed text-black/75">{preview.excerpt}</p>
</a>
