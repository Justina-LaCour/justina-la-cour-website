<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet;
        layout?: "stacked" | "responsive-grid";
        class?: string;
    }

    let {
        children,
        layout = "responsive-grid",
        class: className = ""
    }: Props = $props();
</script>

<div
    class="legal-details {layout === 'responsive-grid' ? 'responsive-grid' : ''} {className}"
>
    {@render children()}
</div>

<style>
    .legal-details {
        display: grid;
        gap: 1.5rem;
        padding-top: 2rem;
        border-top: 1px solid var(--color-divider);
        color: var(--color-muted);
        font-size: 0.95rem;
        line-height: 1.55;
    }

    .legal-details :global(h2) {
        margin: 0 0 0.35rem;
        color: rgb(0 0 0 / 0.78);
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.25;
    }

    .legal-details :global(p),
    .legal-details :global(address) {
        margin: 0;
        font-style: normal;
    }

    @container page-content (min-width: 720px) {
        .legal-details.responsive-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
</style>
