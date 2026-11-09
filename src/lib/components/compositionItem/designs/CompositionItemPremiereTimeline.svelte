<script lang="ts">
    import CompositionItemRecordings from "../CompositionItemRecordings.svelte";
    import type { CompositionItemDesignProps } from "../compositionItem";

    let { preview }: CompositionItemDesignProps = $props();
</script>

<div class="grid gap-8 md:grid-cols-[minmax(0,1fr)_16rem]">
    <div class="border-l-2 border-primary pl-6 sm:pl-8">
        <p class="m-0 text-xs font-bold tracking-[0.14em] uppercase text-muted">{preview.composition.compositionYear} · {preview.composition.category}</p>
        <h2 class="mt-3 font-heading text-3xl leading-tight text-primary-dark wrap-anywhere">{preview.composition.title}</h2>
        <p class="mt-3 font-semibold text-primary-dark">{preview.composition.instrumentation}{preview.composition.duration ? ` · ${preview.composition.duration}` : ""}</p>
        {#if preview.composition.description}<p class="mt-6 max-w-3xl whitespace-pre-line leading-relaxed text-black/75">{preview.composition.description}</p>{/if}
        <CompositionItemRecordings {preview} />
    </div>
    <aside class="self-start bg-primary-dark/5 p-5 text-sm">
        {#if preview.composition.hasBeenPremiered}<p class="m-0 text-xs font-bold tracking-wider uppercase text-primary-dark">{preview.labels.premiere}</p><p class="mt-2 leading-relaxed">{preview.premiereDetails}</p>{/if}
        {#if preview.composition.publisher}<p class="mt-5"><strong>{preview.labels.publisher}:</strong><br />{preview.composition.publisher}</p>{/if}
        {#if preview.buySheetHref}<a class="mt-5 inline-block font-bold text-primary underline" href={preview.buySheetHref} target="_blank" rel="noopener noreferrer">{preview.labels.buyScore}</a>{/if}
    </aside>
</div>
