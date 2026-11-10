<script lang="ts">
    import type { ConcertPreviewItemDesignProps } from "../concertPreviewItem";

    let { preview }: ConcertPreviewItemDesignProps = $props();
</script>

<div class="overflow-hidden rounded-2xl border border-primary-dark bg-background shadow-[0_0.75rem_2rem_rgb(0_0_0/0.08)] sm:grid sm:grid-cols-[10rem_minmax(0,1fr)]">
    <div class="flex flex-col justify-between bg-primary-dark px-5 py-6 text-white">
        <time
            class="font-heading text-2xl leading-tight"
            datetime={preview.performanceDateTime}
        >
            {preview.formattedDate}
        </time>
    </div>
    <div class="relative p-6">
        <h4 class="m-0 font-heading text-3xl leading-tight text-primary-dark wrap-anywhere">
            {preview.concert.title}
        </h4>
        <p class="font-semibold text-muted">{preview.performance.venueName}</p>
        {#if preview.concert.shortDescription}
            <p class="mt-4 text-sm leading-relaxed">
                {preview.concert.shortDescription}
            </p>
        {/if}
        {#if preview.link}
            <a
                class="transition-ui reduce-motion mt-5 inline-flex items-center gap-2 font-bold text-primary-dark hover:text-primary"
                href={preview.link.href}
                target={preview.link.target}
                rel={preview.link.rel}
            >
                {preview.link.label} <span aria-hidden="true">→</span>
            </a>
        {/if}
    </div>
</div>
