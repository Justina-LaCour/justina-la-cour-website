<script lang="ts">
    import type { ConcertPreviewItemDesignProps } from "../concertPreviewItem";

    let { preview }: ConcertPreviewItemDesignProps = $props();
</script>

<div class="relative overflow-hidden border border-primary-dark/20 bg-surface">
    <div class="flex items-center justify-between gap-4 bg-primary-dark p-4 text-white">
        <time
            class="text-xs font-bold tracking-[0.14em] uppercase"
            datetime={preview.performanceDateTime}
        >
            {preview.formattedDate}
        </time>
    </div>
    <div class="p-4">
        <p class="m-0 text-xs font-bold tracking-[0.2em] uppercase text-primary-dark">
            {preview.performance.venueName}
        </p>
        <h4 class="font-heading text-3xl leading-tight text-primary-dark wrap-anywhere">
            {preview.concert.title}
        </h4>
        {#if preview.concert.shortDescription}
            <p class="mt-5 max-w-2xl leading-relaxed text-muted">
                {preview.concert.shortDescription}
            </p>
        {/if}
        {#if preview.link}
            <a
                class="transition-ui reduce-motion mt-6 inline-flex size-12 items-center justify-center rounded-full border border-primary-dark text-xl text-primary-dark hover:bg-primary-dark hover:text-white"
                href={preview.link.href}
                target={preview.link.target}
                rel={preview.link.rel}
            >
                <span class="sr-only">{preview.link.label}</span>
                <span aria-hidden="true">→</span>
            </a>
        {/if}
    </div>
</div>
