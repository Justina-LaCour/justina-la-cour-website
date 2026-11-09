<script lang="ts">
    import RecordingPlayer from "$lib/artkyt/components/RecordingPlayer.svelte";
    import type { CompositionItemDesignProps } from "./compositionItem";

    let { preview }: CompositionItemDesignProps = $props();
</script>

{#if preview.playableRecordings.length > 0}
    <section class="mt-8 grid gap-5">
        <h3 class="text-subsection-title text-primary-dark">
            {preview.labels.recordings}
        </h3>
        {#each preview.playableRecordings as recording}
            <RecordingPlayer platform={recording.platform} url={recording.url} />
        {/each}
    </section>
{/if}
