<script lang="ts">
    import type { ConcertPreviewItemDesignProps } from "../concertPreviewItem";

    let { preview }: ConcertPreviewItemDesignProps = $props();
</script>

<div class="flex h-full flex-col bg-primary-dark p-6 text-white md:p-8">
    <time
        class="mb-10 w-fit border border-white/30 px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase"
        datetime={preview.performanceDateTime}
    >
        {preview.formattedDate}
    </time>
    <h4 class="m-0 font-heading text-3xl leading-tight text-white wrap-anywhere">
        {preview.concert.title}
    </h4>
    <p class="mt-3 text-lg text-white/75">{preview.performance.venueName}</p>
    {#if preview.concert.shortDescription}
        <p class="mt-6 line-clamp-3 text-white/75">
            {preview.concert.shortDescription}
        </p>
    {/if}
    {#if preview.link}
        <a
            class="transition-ui reduce-motion mt-auto pt-8 font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
            href={preview.link.href}
            target={preview.link.target}
            rel={preview.link.rel}
        >
            {preview.link.label} <span aria-hidden="true">↗</span>
        </a>
    {/if}
</div>
