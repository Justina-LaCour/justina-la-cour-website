<script lang="ts">
    import CompositionItemRecordings from "../CompositionItemRecordings.svelte";
    import type { CompositionItemDesignProps } from "../compositionItem";

    let { preview }: CompositionItemDesignProps = $props();
</script>

<div class="overflow-hidden border border-primary-dark/20 bg-background shadow-[0_1rem_3rem_rgb(0_0_0/0.15)]">
    <div class="grid lg:grid-cols-[minmax(16rem,0.8fr)_1.2fr]">
        {#if preview.coverImageSrc}
            <img src={preview.coverImageSrc} alt="" class="aspect-4/3 h-full w-full object-cover lg:aspect-auto" />
        {:else}
            <div class="flex min-h-64 items-end bg-linear-to-br from-primary-dark to-primary p-6 text-6xl font-light text-white/30" aria-hidden="true">{preview.composition.compositionYear}</div>
        {/if}
        <div class="p-6 sm:p-8">
            <p class="m-0 text-xs font-bold tracking-[0.2em] uppercase text-muted">{preview.composition.category} · {preview.composition.compositionYear}</p>
            <h2 class="mt-3 font-heading text-3xl leading-tight text-primary-dark wrap-anywhere">{preview.composition.title}</h2>
            <p class="mt-3 font-semibold text-primary">{preview.composition.instrumentation}{preview.composition.duration ? ` · ${preview.composition.duration}` : ""}</p>
            {#if preview.composition.description}<p class="mt-6 whitespace-pre-line leading-relaxed text-black/75">{preview.composition.description}</p>{/if}
            {#if preview.composition.hasBeenPremiered}<div class="mt-6 bg-primary-dark/5 p-4 text-sm"><strong>{preview.labels.premiere}</strong><p class="mt-1">{preview.premiereDetails}</p></div>{/if}
            <div class="mt-6 flex flex-wrap gap-4 text-sm">
                {#if preview.composition.publisher}<span><strong>{preview.labels.publisher}:</strong> {preview.composition.publisher}</span>{/if}
                {#if preview.buySheetHref}<a class="font-bold text-primary underline" href={preview.buySheetHref} target="_blank" rel="noopener noreferrer">{preview.labels.buyScore}</a>{/if}
            </div>
        </div>
    </div>
    {#if (preview.composition.recordings?.length ?? 0) > 0}
        <div class="px-6 pb-6 sm:px-9 sm:pb-9"><CompositionItemRecordings {preview} /></div>
    {/if}
</div>
