<script lang="ts">
    import NewsCardImage from "../NewsCardImage.svelte";
    import type { NewsCardDesignProps } from "../newsCard";
    let { preview }: NewsCardDesignProps = $props();
</script>

<a class="relative block min-h-112 overflow-hidden bg-primary-dark text-white" href={preview.href}>
    <NewsCardImage {preview} class="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-55 motion-reduce:transition-none" />
    <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-black/10"></div>
    <div class="relative flex min-h-112 flex-col justify-end p-6 sm:p-8">
        {#if preview.publishedAt}<time class="text-xs font-bold tracking-[0.14em] uppercase text-white/75" datetime={preview.news.publishedAt}>{preview.publishedAt}</time>{/if}
        <h2 class="mt-3 max-w-3xl font-heading text-3xl leading-tight text-white wrap-anywhere sm:text-5xl">{preview.news.title}</h2>
        <p class="mt-4 max-w-2xl line-clamp-3 text-white/75">{preview.excerpt}</p>
        <span class="mt-6 font-bold text-white">{preview.readMoreLabel} ↗</span>
    </div>
</a>
