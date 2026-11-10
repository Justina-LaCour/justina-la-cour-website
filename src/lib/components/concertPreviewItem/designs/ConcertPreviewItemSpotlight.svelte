<script lang="ts">
    import type { ConcertPreviewItemDesignProps } from "../concertPreviewItem";

    let { preview }: ConcertPreviewItemDesignProps = $props();
</script>

<div class="relative isolate min-h-80 overflow-hidden rounded-4xl bg-primary-dark p-6 text-white shadow-[0_1rem_3rem_rgb(0_0_0/0.15)] sm:p-10">
    <span class="absolute -top-24 -right-20 -z-10 size-72 rounded-full bg-primary/55 blur-3xl" aria-hidden="true"></span>
    <span class="absolute right-14 bottom-10 -z-10 size-24 rounded-full border border-white/30" aria-hidden="true"></span>
    <time
        class="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.14em] uppercase backdrop-blur"
        datetime={preview.performanceDateTime}
    >
        {preview.formattedDate}
    </time>
    <h4 class="mt-12 max-w-2xl font-heading text-3xl leading-none text-white wrap-anywhere sm:text-5xl">
        {preview.concert.title}
    </h4>
    <p class="mt-4 text-lg text-white/75">{preview.performance.venueName}</p>
    {#if preview.link}
        <a
            class="transition-ui reduce-motion mt-8 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-bold text-primary-dark hover:bg-primary hover:text-white"
            href={preview.link.href}
            target={preview.link.target}
            rel={preview.link.rel}
        >
            {preview.link.label} <span aria-hidden="true">↗</span>
        </a>
    {/if}
</div>
