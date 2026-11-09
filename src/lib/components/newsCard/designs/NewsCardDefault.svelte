<script lang="ts">
    import NewsCardImage from "../NewsCardImage.svelte";
    import type { NewsCardDesignProps } from "../newsCard";

    let { preview }: NewsCardDesignProps = $props();
</script>

<a class="grid h-full sm:grid-cols-[minmax(12rem,0.7fr)_1fr]" href={preview.href}>
    <NewsCardImage
        {preview}
        class="aspect-4/3 h-full w-full bg-primary-dark/10 object-cover sm:aspect-auto"
    />

    <div class="flex flex-col p-6">
        {#if preview.publishedAt}
            <time class="mb-3 text-sm text-muted" datetime={preview.news.publishedAt}>
                {preview.publishedAt}
            </time>
        {/if}
        <h2 class="text-section-title text-primary-dark">{preview.news.title}</h2>
        {#if preview.news.content}
            <p class="mt-3 text-black/75">{preview.excerpt}</p>
        {/if}
        <span class="transition-ui reduce-motion mt-auto pt-6 font-semibold text-primary group-hover:underline">
            {preview.readMoreLabel}
        </span>
    </div>
</a>
