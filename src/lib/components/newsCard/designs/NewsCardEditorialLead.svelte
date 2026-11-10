<script lang="ts">
    import NewsCardImage from "../NewsCardImage.svelte";
    import type { NewsCardDesignProps } from "../newsCard";
    let { preview }: NewsCardDesignProps = $props();
</script>

<a class="grid h-full gap-6 border-t-4 border-primary-dark pt-5 md:grid-cols-[minmax(0,1.25fr)_minmax(15rem,0.75fr)]" href={preview.href}>
    <div class="flex flex-col">
        {#if preview.publishedAt}<time class="text-xs font-bold tracking-[0.14em] uppercase text-muted" datetime={preview.news.publishedAt}>{preview.publishedAt}</time>{/if}
        <h2 class="mt-4 font-heading text-5xl leading-none text-primary-dark wrap-anywhere">{preview.news.title}</h2>
        <p class="mt-5 max-w-2xl text-lg leading-relaxed text-black/75">{preview.excerpt}</p>
        <span class="mt-auto pt-6 font-bold text-primary group-hover:underline">{preview.readMoreLabel} →</span>
    </div>
    <NewsCardImage {preview} class="aspect-4/3 h-full min-h-64 w-full object-cover" />
</a>
