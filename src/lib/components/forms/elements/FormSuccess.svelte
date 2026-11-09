<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();

</script>

<div
    class="flex flex-col items-center"
    role="status"
    aria-live="polite"
>
    <img class="w-full max-w-40" src="/icons/ok.svg" alt="" />
    <p>
        {@render children?.()}
    </p>
</div>
