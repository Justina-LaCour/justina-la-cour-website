<script lang="ts">
    import CompositionItemRecordings from "../CompositionItemRecordings.svelte";
    import type { CompositionItemDesignProps } from "../compositionItem";

    let { preview }: CompositionItemDesignProps = $props();
</script>

<div class="grid gap-7 border-t-4 border-primary-dark pt-6 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-10">
    <div class="text-sm text-muted">
        <p class="m-0 text-3xl font-light text-primary-dark">{preview.composition.compositionYear}</p>
        {#if preview.composition.duration}<p class="mt-3">{preview.composition.duration}</p>{/if}
        {#if preview.composition.category}<p class="mt-1 uppercase tracking-wider">{preview.composition.category}</p>{/if}
    </div>
    <div>
        <h2 class="m-0 font-heading text-5xl leading-none text-primary-dark wrap-anywhere">{preview.composition.title}</h2>
        {#if preview.composition.instrumentation}<p class="mt-4 font-semibold text-primary">{preview.composition.instrumentation}</p>{/if}
        {#if preview.composition.description}<p class="mt-6 max-w-3xl whitespace-pre-line text-lg leading-relaxed">{preview.composition.description}</p>{/if}
        {#if preview.composition.hasBeenPremiered}<p class="mt-6 border-l-2 border-primary pl-4 text-sm"><strong>{preview.labels.premiere}</strong><br />{preview.premiereDetails}</p>{/if}
        {#if preview.composition.publisher || preview.buySheetHref}
            <p class="mt-6 text-sm text-muted">
                {#if preview.composition.publisher}<strong>{preview.labels.publisher}:</strong> {preview.composition.publisher}{/if}
                {#if preview.buySheetHref}<a class="ml-4 font-semibold text-primary underline" href={preview.buySheetHref} target="_blank" rel="noopener noreferrer">{preview.labels.buyScore}</a>{/if}
            </p>
        {/if}
        <CompositionItemRecordings {preview} />
    </div>
</div>
