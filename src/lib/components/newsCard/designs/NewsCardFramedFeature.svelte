<script lang="ts">
    import NewsCardImage from "../NewsCardImage.svelte";
    import type { NewsCardDesignProps } from "../newsCard";
    let { preview }: NewsCardDesignProps = $props();
</script>

<a class="block h-full bg-primary-dark p-3 text-white sm:p-4" href={preview.href}>
    <div class="border border-white/30 p-4 sm:p-6">
        <NewsCardImage {preview} class="aspect-16/9 w-full object-cover" />
        <div class="py-5 sm:px-2 sm:pt-6">
            {#if preview.publishedAt}<time class="text-xs font-bold tracking-[0.14em] uppercase text-white/75" datetime={preview.news.publishedAt}>{preview.publishedAt}</time>{/if}
            <h2 class="mt-3 font-heading text-3xl leading-tight text-white wrap-anywhere">{preview.news.title}</h2>
            <p class="mt-4 line-clamp-3 leading-relaxed text-white/75">{preview.excerpt}</p>
            <span class="mt-6 inline-block font-bold text-white underline decoration-white/40 underline-offset-4 group-hover:decoration-white">{preview.readMoreLabel}</span>
        </div>
    </div>
</a>
