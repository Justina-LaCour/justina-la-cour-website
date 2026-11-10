<script lang="ts">
    import CompositionItemRecordings from "../CompositionItemRecordings.svelte";
    import type { CompositionItemDesignProps } from "../compositionItem";

    let { preview }: CompositionItemDesignProps = $props();
</script>

<div class="relative isolate overflow-hidden bg-primary-dark p-6 text-white sm:p-10">
    <span class="absolute -top-32 -right-24 -z-10 size-80 rounded-full bg-primary/40 blur-3xl" aria-hidden="true"></span>
    <div class="flex flex-wrap justify-between gap-5 text-xs font-bold tracking-[0.14em] text-white/75 uppercase">
        <span>{preview.composition.category} · {preview.composition.compositionYear}</span>
        {#if preview.composition.duration}<span>{preview.composition.duration}</span>{/if}
    </div>
    <h2 class="mt-12 max-w-4xl font-heading text-5xl leading-none text-white wrap-anywhere sm:text-6xl">{preview.composition.title}</h2>
    <p class="mt-5 text-lg text-white/75">{preview.composition.instrumentation}</p>
    {#if preview.composition.description}<p class="mt-8 max-w-3xl whitespace-pre-line leading-relaxed text-white/75">{preview.composition.description}</p>{/if}
    {#if preview.composition.hasBeenPremiered}<div class="mt-8 border-l border-white/50 pl-5"><strong>{preview.labels.premiere}</strong><p class="mt-1 text-white/75">{preview.premiereDetails}</p></div>{/if}
    <div class="mt-8 flex flex-wrap items-center gap-5 text-sm text-white/75">
        {#if preview.composition.publisher}<span><strong class="text-white">{preview.labels.publisher}:</strong> {preview.composition.publisher}</span>{/if}
        {#if preview.buySheetHref}<a class="rounded-full bg-white px-5 py-2 font-bold text-primary-dark" href={preview.buySheetHref} target="_blank" rel="noopener noreferrer">{preview.labels.buyScore}</a>{/if}
    </div>
    <div class="[&_h3]:text-white"><CompositionItemRecordings {preview} /></div>
</div>
