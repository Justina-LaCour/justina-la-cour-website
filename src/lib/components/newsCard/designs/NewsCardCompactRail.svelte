<script lang="ts">
    import NewsCardImage from "../NewsCardImage.svelte";
    import type { NewsCardDesignProps } from "../newsCard";
    let { preview }: NewsCardDesignProps = $props();
</script>

<a class="grid h-full grid-cols-[6.5rem_minmax(0,1fr)] gap-5 border-b border-primary-dark/25 py-5 sm:grid-cols-[10rem_minmax(0,1fr)_auto]" href={preview.href}>
    <NewsCardImage {preview} class="aspect-square h-full max-h-40 w-full object-cover" />
    <div class="min-w-0">
        {#if preview.publishedAt}<time class="text-xs text-muted" datetime={preview.news.publishedAt}>{preview.publishedAt}</time>{/if}
        <h2 class="mt-1 text-2xl font-semibold leading-tight text-primary-dark wrap-anywhere">{preview.news.title}</h2>
        <p class="mt-2 line-clamp-2 text-sm text-muted">{preview.excerpt}</p>
    </div>
    <span class="hidden self-center rounded-full border border-primary-dark px-4 py-2 text-sm font-bold text-primary-dark group-hover:bg-primary-dark group-hover:text-white sm:block">{preview.readMoreLabel}</span>
</a>
