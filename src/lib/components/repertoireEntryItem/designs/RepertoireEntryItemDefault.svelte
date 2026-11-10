<script lang="ts">
    import type { RepertoireEntryItemDesignProps } from "../repertoireEntryItem";

    let { preview }: RepertoireEntryItemDesignProps = $props();
</script>

{#if preview.entry.type === "piece"}
    <div class="flex items-center justify-between gap-4">
        <div class="flex items-baseline gap-2">
            <div class="font-bold text-primary-dark">{preview.entry.composerName}</div>
            <div>{preview.entry.title}</div>
            {#if preview.details}
                <div class="font-light">({preview.details})</div>
            {/if}
        </div>
        {#if preview.duration}
            <span class="m-0 whitespace-nowrap @max-[520px]/page-content:text-sm">
                {preview.duration}
            </span>
        {/if}
    </div>

    {#if preview.entry.description}
        <p class="mt-3.5 max-w-3xl whitespace-pre-line text-black/75">
            {preview.entry.description}
        </p>
    {/if}
{:else}
    <span>{preview.intermissionLabel}</span>
    {#if preview.duration}
        <span>{preview.duration}</span>
    {/if}
{/if}
