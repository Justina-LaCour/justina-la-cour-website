<script lang="ts">
    interface Props {
        sanitizedHtml: string;
        class?: string;
    }

    let { sanitizedHtml, class: className = "" }: Props = $props();
</script>

{#if sanitizedHtml}
    <div class={`rich-text prose max-w-none text-foreground ${className}`.trim()}>
        {@html sanitizedHtml}
    </div>
{/if}

<style>
    .rich-text :global(a) {
        text-decoration: underline;
    }

    .rich-text :global(p) {
        margin-top: 0;
        margin-bottom: 0.25em;
    }

    .rich-text :global(p):empty {
        margin-bottom: 2em;
    }
</style>
