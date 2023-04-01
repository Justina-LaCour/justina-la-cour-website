<script lang="ts">
    import Modal from "../../modals/Modal.svelte";

    let modal: Modal;

    let text: string = "";

    export function show(textToShow: string) {
        modal.show();
        text = textToShow;
        console.log(text);
    }

    async function copyText() {
        await navigator.clipboard.writeText(text);
    }

</script>

<Modal bind:this={modal}>
    <button class="soft-button" on:click={copyText} slot="left-button">
        <img class="icon" src="/icons/copy.svg" alt="copy" />
    </button>

    <div class="textedit" contenteditable="true" bind:textContent={text}></div>
</Modal>

<style>
    .textedit {
        background-color: white;
        white-space: pre-line;
        padding: 0.5rem;
    }
</style>