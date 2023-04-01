<script lang="ts">

    import { type DocumentReference, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
    import { ref, type FirebaseStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
    import { onMount, createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let pictureRef: DocumentReference;

    let storageCopy: FirebaseStorage | null = null;

    let url: string = "";
    let thumbnailUrl: string = "";
    let copyright: string = "";
    let date: Date = new Date();

    let hash: string = "";

    let thumbnailInput: HTMLInputElement;
    let thumbnailUploadProgress: number = -1;
    let fullresInput: HTMLInputElement;
    let fullresUploadProgress: number = -1;

    onMount(async () => {
        const { storage }  = await import("../../firebase");

        storageCopy = storage;

        const snapshot = await getDoc(pictureRef);
        const data = snapshot.data();
        if (!data) return;

        url = data.url;
        thumbnailUrl = data.thumbnailUrl;
        copyright = data.copyright;
        date = data.uploadedDate.toDate();

        hash = url + thumbnailUrl + copyright;
    });

    function uploadThumbnail() {
        if (!storageCopy) return;

        const file = (thumbnailInput.files as FileList)[0];

        const cloudFileName = `gallery/thumbnails/${idBase}-${file.name}`;
        const cloudRef = ref(storageCopy, cloudFileName);

        const uploadTask = uploadBytesResumable(cloudRef, file);

        uploadTask.on("state_changed",
            (snapshot) => {
                thumbnailUploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    thumbnailUrl = url;
                    thumbnailUploadProgress = -1;
                });
            }
        );
    }

    function uploadFullres() {
        if (!storageCopy) return;

        const file = (fullresInput.files as FileList)[0];

        const cloudFileName = `gallery/fullres/${idBase}-${file.name}`;
        const cloudRef = ref(storageCopy, cloudFileName);

        const uploadTask = uploadBytesResumable(cloudRef, file);

        uploadTask.on("state_changed",
            (snapshot) => {
                fullresUploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((imageUrl) => {
                    url = imageUrl;
                    fullresUploadProgress = -1;
                });
            }
        );
    }

    export async function save() {
        if (!modified) return;

        const data = {
            thumbnailUrl,
            url,
            copyright,
            date
        };
        await updateDoc(pictureRef, data);
        hash = url + thumbnailUrl + copyright;
    }

    async function deletePicture() {
        await deleteDoc(pictureRef);
        dispatch("deleted", {
            ref: pictureRef
        });
    }

    const idBase = "" + Math.ceil(Math.random() * 10000);

    $: modified = hash !== (url + thumbnailUrl + copyright);
</script>

<div class="editor-container" class:modified={modified}>
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img src={thumbnailUrl} alt="Image thumbnail" class="thumb-img" />

    <div class="thumb-url">
        <div>{thumbnailUrl}</div>

        {#if thumbnailUploadProgress >= 0}
            <div>Uploading thumbnail ({thumbnailUploadProgress}%)</div>
        {:else}
            <label class="custom-file-upload cta-inverted">
                <input type="file" accept="image/*" bind:this={thumbnailInput} on:change={uploadThumbnail} />
                Upload thumbnail image
            </label>
        {/if}
        <div class="info">Make sure that the thumbnail is roughly a square or that the subject is at the center of the picture</div>
    </div>

    <div class="url">
        <div>{url}</div>
        {#if fullresUploadProgress >= 0}
            <div>Uploading image ({fullresUploadProgress}%)</div>
        {:else}
            <label class="custom-file-upload cta-inverted">
                <input type="file" accept="image/*" bind:this={fullresInput} on:change={uploadFullres} />
                Upload full resolution image
            </label>
        {/if}
    </div>
    
    <div class="copyright">
        <label for="{idBase}-copyright" class="copyright-label">Copyright</label>
        <input type="text" id="{idBase}-copyright" class="copyright-field" bind:value={copyright} />
    </div>

    <div class="uploaded">
        Uploaded on <br />
        { date.toLocaleDateString() }
    </div>

    <div class="delete-button">
        <button on:click={deletePicture}>Delete picture</button>
    </div>
</div>

<style>
    .editor-container {
        grid-template-areas:
            "thumb-img thumb-url url delete-button"
            "thumb-img copyright uploaded delete-button";
        
        grid-template-columns: 200px 1fr 1fr 10rem;
        grid-template-rows: min-content min-content;
    }

    .custom-file-upload {
        display: inline-block;
        margin: 0.5rem 0;
        padding: 0.25rem;
        border-radius: 0.5rem;
        cursor: pointer;
    }

    input[type="file"] {
        display: none;
    }

    .thumb-img {
        grid-area: thumb-img;
        display: block;
        max-width: 100%;
        max-height: 100%;
    }

    .thumb-url {
        grid-area: thumb-url;
    }

    .url {
        grid-area: url;
    }

    .copyright {
        grid-area: copyright;
    }

    .uploaded {
        grid-area: uploaded;
    }

    .info {
        font-style: italic;
        font-size: 0.8rem;
    }
</style>