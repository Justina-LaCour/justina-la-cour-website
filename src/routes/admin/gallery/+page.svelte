<script lang="ts">

    import { onMount } from "svelte";
    import { addDoc, type CollectionReference, type DocumentReference } from "firebase/firestore";
    import GalleryPicture from "../../../components/admin/GalleryPicture.svelte";
    import LoadingSpinner from "../../../components/utils/LoadingSpinner.svelte";
    
    let galleryCol: CollectionReference | null = null;

    let picturesRefs: DocumentReference[] = [];

    let singleEditors: GalleryPicture[] = [];

    let saving: boolean = false;

    onMount(async () => {
        const { galleryCollection, getPictures }  = await import("../../../firebase");
        galleryCol = galleryCollection;
        picturesRefs = (await getPictures()).docs.map((d) => d.ref);
    });

    async function addPicture() {
        if (!galleryCol) return;

        const docRef = await addDoc(galleryCol, {
            url: "/imgs/gallery_default.jpg",
            thumbnailUrl: "/imgs/gallery_default.jpg",
            copyright: "Something similar",
            uploadedDate: new Date()
        });

        picturesRefs = [...picturesRefs, docRef];
    }

    async function save() {
        saving = true;

        const promises = [];

        for (const editor of singleEditors) {
            promises.push(editor.save());
        }

        await Promise.all(promises);

        saving = false;
    }

    function onDelete(event: any) {
        picturesRefs = picturesRefs.filter((ref) => ref !== event.detail.ref);
    }

</script>

<div>
    <h2>Edit Gallery</h2>

    <div class="editor-wrapper">
        <div class="toolbar">
            <button on:click={addPicture}>Add picture</button>
            <button on:click={save}>Save</button>
        </div>
    
        {#if saving}
            <div class="saving-backdrop">
                <LoadingSpinner message="Saving gallery..." />
            </div>
        {:else}
            {#each picturesRefs as picture, i}
                <GalleryPicture pictureRef={picture} bind:this={singleEditors[i]} on:deleted={onDelete} />
            {/each}
        {/if}
    </div>
</div>