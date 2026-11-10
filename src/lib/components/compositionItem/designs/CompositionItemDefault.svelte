<script lang="ts">
    import CompositionItemRecordings from "../CompositionItemRecordings.svelte";
    import type { CompositionItemDesignProps } from "../compositionItem";

    let { preview }: CompositionItemDesignProps = $props();
</script>

<header class="flex flex-wrap items-start justify-between gap-4">
    <div>
        <h2 class="text-section-title text-primary-dark">
            {preview.composition.title}
        </h2>
        {#if preview.composition.compositionYear}
            <p class="mt-1 text-muted">{preview.composition.compositionYear}</p>
        {/if}
    </div>

    {#if preview.composition.duration}
        <p class="flex items-center gap-2 whitespace-nowrap">
            <img class="h-5 w-5" src="/icons/clock.svg" alt="" />
            {preview.composition.duration}
        </p>
    {/if}
</header>

{#if preview.composition.instrumentation}
    <p class="mt-4 flex items-start gap-2">
        <img class="mt-0.5 h-5 w-5" src="/icons/violin.svg" alt="" />
        <span>{preview.composition.instrumentation}</span>
    </p>
{/if}

{#if preview.composition.description}
    <p class="mt-5 whitespace-pre-line leading-relaxed text-black/80">
        {preview.composition.description}
    </p>
{/if}

{#if preview.composition.hasBeenPremiered}
    <section class="mt-6 border-l-2 border-primary px-4">
        <h3 class="font-semibold text-primary-dark">{preview.labels.premiere}</h3>
        <p class="mt-1">{preview.premiereDetails}</p>
    </section>
{/if}

{#if preview.composition.publisher || preview.buySheetHref}
    <div class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        {#if preview.composition.publisher}
            <span><strong>{preview.labels.publisher}:</strong> {preview.composition.publisher}</span>
        {/if}
        {#if preview.buySheetHref}
            <a class="font-semibold text-primary underline" href={preview.buySheetHref} target="_blank" rel="noopener noreferrer">
                {preview.labels.buyScore}
            </a>
        {/if}
    </div>
{/if}

<CompositionItemRecordings {preview} />
