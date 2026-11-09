<script lang="ts">
    import type { ConcertPreviewItemDesignProps } from "../concertPreviewItem";

    let { preview }: ConcertPreviewItemDesignProps = $props();
</script>

<div class="text-center">
    <span class="mx-auto my-5 block h-px w-16 bg-primary" aria-hidden="true"></span>
    <time
        class="text-sm font-semibold tracking-[0.14em] uppercase text-primary-dark"
        datetime={preview.performanceDateTime}
    >
        {preview.formattedDate}
    </time>
    <h4 class="mx-auto mt-2 max-w-2xl font-heading text-3xl leading-tight text-primary-dark wrap-anywhere">
        {preview.concert.title}
    </h4>
    <p class="text-lg italic text-muted">{preview.performance.venueName}</p>
    {#if preview.concert.shortDescription}
        <p class="mx-auto mt-4 max-w-xl leading-relaxed">
            {preview.concert.shortDescription}
        </p>
    {/if}
    {#if preview.link}
        <a
            class="transition-ui reduce-motion mt-7 inline-block border-b border-primary-dark pb-1 text-sm font-bold tracking-widest uppercase text-primary-dark hover:border-primary hover:text-primary"
            href={preview.link.href}
            target={preview.link.target}
            rel={preview.link.rel}
        >
            {preview.link.label}
        </a>
    {/if}
</div>
