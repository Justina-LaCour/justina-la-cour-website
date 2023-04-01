<script lang="ts">
    import type { GalleryPicture } from "../../stores/gallery";
    import Modal from "./Modal.svelte";

    let modal: Modal;

    let picture: GalleryPicture = {
        copyright: "",
        url: "",
        thumbnailUrl: "",
        uploadedDate: new Date()
    };

    export function show(galleryPicture: GalleryPicture) {
        modal.show();
        picture = galleryPicture;
    }

    async function downloadPicture() {
        const response = await fetch(picture.url);
        const blob = await response.blob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.style.display = "none";
        a.download = "Justina_La_Cour";

        document.body.appendChild(a);
        a.click();
        a.remove();
    }

</script>

<Modal bind:this={modal}>
    <button class="soft-button" on:click={downloadPicture} slot="left-button">
        <img class="icon" src="/icons/download.svg" alt="Download" />
    </button>

    <img src={picture.url} alt={picture.copyright} class="image" />
    <div class="copyright">
        &#169; { picture.copyright }
    </div>
</Modal>

<style>

    .image {
        max-width: 90vw;
        max-height: 70vh;
    }

</style>