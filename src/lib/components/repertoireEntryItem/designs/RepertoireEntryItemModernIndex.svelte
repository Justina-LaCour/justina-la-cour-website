<script lang="ts">
    import type { RepertoireEntryItemDesignProps } from "../repertoireEntryItem";

    let { preview }: RepertoireEntryItemDesignProps = $props();
</script>

{#if preview.entry.type === "piece"}
    <div class="grid gap-4 border-b border-primary-dark pb-4 mb-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div class="min-w-0">
            <h3 class="m-0 text-xl font-semibold leading-tight text-primary-dark wrap-anywhere">
                {preview.entry.title}
            </h3>
            <p class="mt-1 text-xs font-bold tracking-widest uppercase text-primary">
                {preview.entry.composerName}
            </p>
            {#if preview.entry.description}
                <p class="mt-4 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-muted">
                    {preview.entry.description}
                </p>
            {/if}
        </div>
        <div class="flex flex-wrap items-start gap-2 sm:max-w-48 sm:flex-col sm:items-end">
            {#if preview.duration}
                <span class="bg-primary-dark px-3 py-1 text-xs font-bold text-white">
                    {preview.duration}
                </span>
            {/if}
            {#if preview.details}
                <span class="text-right text-xs text-muted">{preview.details}</span>
            {/if}
        </div>
    </div>
{:else}
    <div class="my-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm text-muted italic">
        <span class="h-px bg-primary-dark/25"></span>
        <span>{preview.intermissionLabel}{preview.duration ? ` · ${preview.duration}` : ""}</span>
        <span class="h-px bg-primary-dark/25"></span>
    </div>
{/if}
