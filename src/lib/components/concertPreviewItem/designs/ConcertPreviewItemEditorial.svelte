<script lang="ts">
    import type { ConcertPreviewItemDesignProps } from "../concertPreviewItem";

    let { preview }: ConcertPreviewItemDesignProps = $props();
</script>

<div class="grid gap-5 border-b border-primary-dark/30 py-8 md:grid-cols-[minmax(0,1fr)_12rem] md:gap-10">
    <div>
        <p class="mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-muted">
            {preview.formattedDate} · {preview.performance.venueName}
        </p>
        <h4 class="m-0 max-w-4xl font-heading text-3xl leading-tight text-primary-dark wrap-anywhere md:text-5xl">
            {preview.concert.title}
        </h4>
        {#if preview.concert.shortDescription}
            <p class="mt-5 max-w-3xl text-lg leading-relaxed">
                {preview.concert.shortDescription}
            </p>
        {/if}
    </div>
    {#if preview.link}
        <a
            class="transition-ui reduce-motion self-start justify-self-start rounded-full border border-primary-dark px-5 py-2 text-sm font-semibold text-primary-dark hover:bg-primary-dark hover:text-white md:justify-self-end"
            href={preview.link.href}
            target={preview.link.target}
            rel={preview.link.rel}
        >
            {preview.link.label}
        </a>
    {/if}
</div>
