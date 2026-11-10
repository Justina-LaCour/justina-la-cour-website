<script lang="ts">
    import type { ConcertPreviewItemDesignProps } from "../concertPreviewItem";

    let { preview }: ConcertPreviewItemDesignProps = $props();
</script>

<div class="grid items-start gap-3 border-b border-primary-dark/20 py-5 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:gap-6">
    <time
        class="font-medium tabular-nums text-muted"
        datetime={preview.performanceDateTime}
    >
        {preview.formattedDate}
    </time>
    <div class="min-w-0">
        <h4 class="m-0 text-xl font-semibold text-primary-dark wrap-anywhere">
            {preview.concert.title}
        </h4>
        <p class="mt-1 text-sm text-muted">{preview.performance.venueName}</p>
    </div>
    {#if preview.link}
        <a
            class="transition-ui reduce-motion inline-flex size-10 items-center justify-center rounded-full border border-primary-dark text-xl text-primary-dark hover:bg-primary-dark hover:text-white"
            href={preview.link.href}
            target={preview.link.target}
            rel={preview.link.rel}
        >
            <span class="sr-only">{preview.link.label}</span>
            <span aria-hidden="true">↗</span>
        </a>
    {/if}
</div>
