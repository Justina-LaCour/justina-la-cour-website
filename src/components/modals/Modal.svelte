<script lang="ts">
    let dialog: HTMLDialogElement;

    export function show() {
        dialog.showModal();
    }

    export function close() {
        dialog.close();
    }

</script>

<dialog class="bg-mid-light" bind:this={dialog}>
    <div class="toolbar">
        <slot name="left-button" />

        <button class="soft-button" on:click={close}>
            <img class="icon" src="/icons/close.svg" alt="Close" />
        </button>
    </div>

    <slot />
</dialog>

<style>

    dialog {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: none;
        padding: 0.25rem;
        margin: 0;
        border-radius: 0.5rem;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);

        animation: dialog-appear 0.2s ease-out;
    }
    
    dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(5px);
    }

    dialog[open]::backdrop {
        animation: dialog-appear 0.2s ease-out;
    }
    
    .toolbar {
        padding: 0.25rem;
        display: flex;
        justify-content: space-between;
    }

    @keyframes dialog-appear {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

</style>