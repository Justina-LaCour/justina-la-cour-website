<script lang="ts">
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
    import type { Snippet } from "svelte";

    interface Props {
        label: string;
        children?: Snippet;
        title?: Snippet;
        leftButton?: Snippet;
    }

    let { label, title, children, leftButton }: Props = $props();
    const i18n = useI18n();

    let dialog: HTMLDialogElement;
    let contentWrapper: HTMLDivElement;
    let toolbarWrapper: HTMLDivElement;

    export function show() {
        dialog.showModal();
    }

    export function close() {
        dialog.close();
    }

    function handleClick(event: MouseEvent) {
        // Backdrop clicks target the dialog itself; content clicks only bubble through it.
        if (event.target === dialog || event.target === contentWrapper || event.target === toolbarWrapper) close();
    }
</script>

<dialog
    bind:this={dialog}
    aria-label={label}
    onclick={handleClick}
    class="fixed top-0 left-0 w-full h-full max-w-full max-h-full p-4 z-50 bg-transparent"
>
    <div class="flex flex-col w-full h-full">
        <div class="flex justify-between items-center toolbar" bind:this={toolbarWrapper}>
            {#if leftButton}
                {@render leftButton()}
            {:else}
                <div></div>
            {/if}

            <h2 class="text-lg font-bold text-white">
                {@render title?.()}
            </h2>

            <button
                class="transition-ui reduce-motion rounded p-2 text-white hover:bg-primary/50"
                aria-label={i18n.t("common.close")}
                onclick={close}
            >
                <CloseIcon class="block size-6" />
            </button>
        </div>

        <div class="flex flex-1 justify-center items-center modal-content" bind:this={contentWrapper}>
            {@render children?.()}
        </div>
    </div>
</dialog>

<style>

    dialog {
        border: none;
        margin: 0;

        animation: dialog-appear var(--transition-duration-ui) ease-out;
    }

    dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(0.5rem);
    }

    dialog[open]::backdrop {
        animation: dialog-appear var(--transition-duration-ui) ease-out;
    }

    @keyframes dialog-appear {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    .toolbar {
        animation: toolbar-appear var(--transition-duration-fancy) ease-out;
    }

    .modal-content {
        transform: translateY(0.5rem);
        opacity: 0;
        animation: content-appear var(--transition-duration-fancy) ease-out 0.25s forwards;
    }

    @keyframes toolbar-appear {
        0% {
            opacity: 0.5;
            transform: translateY(0.25rem);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes content-appear {
        0% {
            opacity: 0;
            transform: translateY(0.5rem);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        dialog,
        dialog[open]::backdrop {
            animation: none;
        }
    }

</style>
