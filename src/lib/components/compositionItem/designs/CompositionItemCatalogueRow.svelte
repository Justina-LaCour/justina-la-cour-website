<script lang="ts">
    import CompositionItemRecordings from "../CompositionItemRecordings.svelte";
    import type { CompositionItemDesignProps } from "../compositionItem";

    let { preview }: CompositionItemDesignProps = $props();
</script>

<div class="border-y border-primary-dark/25">
    <div class="grid gap-5 py-6 md:grid-cols-[7rem_minmax(0,1fr)_12rem] md:gap-8">
        <p class="m-0 font-mono text-sm text-muted">{preview.composition.compositionYear}</p>
        <div>
            <h2 class="m-0 text-2xl font-semibold text-primary-dark wrap-anywhere">{preview.composition.title}</h2>
            <p class="mt-2 text-sm text-muted">{preview.composition.instrumentation}</p>
            {#if preview.composition.description}<p class="mt-4 max-w-3xl whitespace-pre-line leading-relaxed text-black/75">{preview.composition.description}</p>{/if}
            {#if preview.composition.hasBeenPremiered}<p class="mt-4 text-sm"><strong>{preview.labels.premiere}:</strong> {preview.premiereDetails}</p>{/if}
        </div>
        <div class="text-sm md:text-right">
            {#if preview.composition.duration}<p class="m-0 font-semibold">{preview.composition.duration}</p>{/if}
            {#if preview.composition.publisher}<p class="mt-2 text-muted">{preview.composition.publisher}</p>{/if}
            {#if preview.buySheetHref}<a class="mt-4 inline-block font-bold text-primary underline" href={preview.buySheetHref} target="_blank" rel="noopener noreferrer">{preview.labels.buyScore}</a>{/if}
        </div>
    </div>
    <CompositionItemRecordings {preview} />
</div>
