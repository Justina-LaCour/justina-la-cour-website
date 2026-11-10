<script lang="ts">
    import BookingButtonRow from "$lib/components/concert/BookingButtonRow.svelte";
    import type { ConcertPreviewItemDesignProps } from "../concertPreviewItem";

    let { preview, bookingUrlLabel }: ConcertPreviewItemDesignProps & { bookingUrlLabel?: string } = $props();
</script>

<div class="py-4">
    <time
        class="text-sm font-semibold tracking-[0.14em] uppercase text-primary-dark"
        datetime={preview.performanceDateTime}
    >
        {preview.formattedDate}
    </time>
    <h4 class="mt-2 text-3xl leading-tight wrap-anywhere">
        {preview.concert.title}
    </h4>
    <p class="mt-2 text-base font-medium text-muted">
        {preview.performance.venueName}
    </p>

    {#if preview.concert.shortDescription}
        <p class="mt-5 max-w-2xl leading-relaxed text-muted">
            {preview.concert.shortDescription}
        </p>
    {/if}

    <BookingButtonRow
        performance={preview.performance}
        urlLabel={bookingUrlLabel}
        strongButtonStyle={{ url: true, email: true }}
        class="mt-5"
        children={preview.link ? moreInformation : undefined}
    />

    {#snippet moreInformation()}
        {#if preview.link}
            <a
                href={preview.link.href}
                target={preview.link.target}
                rel={preview.link.rel}
                class="transition-ui reduce-motion inline-flex rounded-full border border-primary-dark bg-primary-dark px-5 py-2 text-sm font-semibold text-white hover:bg-background hover:text-primary-dark"
            >
                {preview.link.label}
            </a>
        {/if}
    {/snippet}
</div>
