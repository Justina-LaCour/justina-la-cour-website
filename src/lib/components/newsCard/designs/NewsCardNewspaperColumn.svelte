<script lang="ts">
    import NewsCardImage from "../NewsCardImage.svelte";
    import type { NewsCardDesignProps } from "../newsCard";
    let { preview }: NewsCardDesignProps = $props();
</script>

<a class="block h-full border-y border-primary-dark py-5" href={preview.href}>
    <NewsCardImage {preview} class="aspect-16/9 w-full object-cover" />
    {#if preview.publishedAt}<time class="mt-5 block text-xs font-bold tracking-[0.2em] uppercase text-muted" datetime={preview.news.publishedAt}>{preview.publishedAt}</time>{/if}
    <h2 class="mt-3 font-heading text-3xl leading-tight text-primary-dark wrap-anywhere">{preview.news.title}</h2>
    <p class="mt-4 leading-relaxed text-black/75">{preview.excerpt}</p>
    <span class="mt-6 inline-block border-b border-primary-dark pb-1 text-sm font-bold uppercase tracking-wider">{preview.readMoreLabel}</span>
</a>
