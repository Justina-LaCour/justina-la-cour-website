<script lang="ts">
    import type { ConcertPreviewItemDesignProps } from "../concertPreviewItem";

    let { preview }: ConcertPreviewItemDesignProps = $props();
</script>

<span
    class="absolute -left-2 top-2 size-3 rounded-full border-2 border-background bg-primary-dark"
    aria-hidden="true"
></span>
<div class="grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8">
    <time
        class="pt-1 text-sm font-semibold tracking-[0.14em] uppercase text-muted"
        datetime={preview.performanceDateTime}
    >
        {preview.formattedDate}
    </time>
    <div>
        <h4 class="m-0 font-heading text-3xl text-primary-dark wrap-anywhere">
            {preview.concert.title}
        </h4>
        <p class="mt-1 text-lg">{preview.performance.venueName}</p>
        {#if preview.concert.shortDescription}
            <p class="mt-3 max-w-2xl text-muted">
                {preview.concert.shortDescription}
            </p>
        {/if}
        {#if preview.link}
            <a
                class="transition-ui reduce-motion mt-4 inline-block border-b border-primary-dark font-semibold text-primary-dark hover:border-primary hover:text-primary"
                href={preview.link.href}
                target={preview.link.target}
                rel={preview.link.rel}
            >
                {preview.link.label} <span aria-hidden="true">→</span>
            </a>
        {/if}
    </div>
</div>
