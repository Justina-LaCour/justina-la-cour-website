<script lang="ts">
    import type { RepertoireEntryItemDesignProps } from "../repertoireEntryItem";

    let { preview }: RepertoireEntryItemDesignProps = $props();
</script>

{#if preview.entry.type === "piece"}
    <div class="grid overflow-hidden border border-primary-dark/50 sm:grid-cols-[14rem_minmax(0,1fr)]">
        <div class="flex bg-primary-dark p-4 text-white sm:items-center">
            <p class="m-0 text-xs font-bold tracking-[0.14em] uppercase">
                {preview.entry.composerName}
            </p>
        </div>
        <div class="p-4">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <h3 class="m-0 font-heading text-2xl leading-tight text-primary-dark wrap-anywhere">
                    {preview.entry.title}
                </h3>
                {#if preview.duration}
                    <span class="whitespace-nowrap text-xs font-semibold text-muted">{preview.duration}</span>
                {/if}
            </div>
            {#if preview.details}
                <p class="mt-2 text-xs tracking-wide text-muted uppercase">{preview.details}</p>
            {/if}
            {#if preview.entry.description}
                <p class="mt-4 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-black/75">
                    {preview.entry.description}
                </p>
            {/if}
        </div>
    </div>
{:else}
    <div class="my-3 flex justify-between gap-4 border border-primary-dark/20 bg-black/5 px-4 py-3 text-sm italic text-muted">
        <span>{preview.intermissionLabel}</span>
        {#if preview.duration}<span>{preview.duration}</span>{/if}
    </div>
{/if}
