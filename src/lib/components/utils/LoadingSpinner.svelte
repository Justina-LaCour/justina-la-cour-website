<script lang="ts">
    interface Props {
        message?: string;
        class?: string;
    }

    let { message = "", class: className }: Props = $props();
</script>

<!-- the color can be changed with the text color property with the class -->
<div
    class="flex flex-col items-center justify-center gap-4 {className}"
    role={message ? "status" : undefined}
    aria-live={message ? "polite" : undefined}
    aria-hidden={message ? undefined : "true"}
>
    <!-- Dual ring -->
    <div class="inline-block w-20 h-20 relative" aria-hidden="true">
        <div
            class="absolute inset-0 m-2 w-16 h-16 rounded-full border-[6px] border-current border-t-transparent border-b-transparent animate-dual-ring"
        ></div>
    </div>

    {#if message}
        <p>{message}</p>
    {/if}
</div>

<style>
    @keyframes dual-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .animate-dual-ring {
        animation: dual-ring 1.2s linear infinite;
    }

    @media (prefers-reduced-motion: reduce) {
        .animate-dual-ring {
            animation: none;
        }
    }
</style>
