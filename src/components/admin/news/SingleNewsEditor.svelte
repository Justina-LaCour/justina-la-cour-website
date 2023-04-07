<script lang="ts">

    import { type DocumentReference, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
    import { ref, type FirebaseStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
    import { onMount, createEventDispatcher } from "svelte";
    import type { NewsContent } from "../../../types/news";
    import NewsContentEditor from "./NewsContentEditor.svelte";

    const dispatch = createEventDispatcher();

    export let newsRef: DocumentReference;

    let storageCopy: FirebaseStorage | null = null;

    let imageUrl: string = "";
    let imageCopyright: string = "";
    let text: {[key: string]: NewsContent} = {};
    let dateString: string = "";

    let hash: string = "";

    let imageInput: HTMLInputElement;
    let imageUploadProgress: number = -1;

    function getHash(): string {
        let h = imageUrl + imageCopyright + dateString;

        Object.values(text).forEach((v) => {
            h += v.title + v.content
        });

        return h;
    }

    onMount(async () => {
        const { storage }  = await import("../../../firebase");

        storageCopy = storage;

        const snapshot = await getDoc(newsRef);
        const data = snapshot.data();
        if (!data) return;

        imageUrl = data.imageUrl;
        text = {
            ...data.text
        };
        imageCopyright = data.imageCopyright;
        dateString = data.date.toDate().toISOString().split("T")[0];

        hash = getHash();
    });

    function uploadImage() {
        if (!storageCopy) return;

        const file = (imageInput.files as FileList)[0];

        const cloudFileName = `news/image/${idBase}-${file.name}`;
        const cloudRef = ref(storageCopy, cloudFileName);

        const uploadTask = uploadBytesResumable(cloudRef, file);

        uploadTask.on("state_changed",
            (snapshot) => {
                imageUploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    imageUrl = url;
                    imageUploadProgress = -1;
                });
            }
        );
    }

    export async function save() {
        if (!modified) return;

        const data = {
            imageUrl,
            imageCopyright,
            text: {
                ...text
            },
            date: new Date(dateString)
        };
        console.log(data);
        await updateDoc(newsRef, data);
        hash = getHash();
    }

    async function deleteNews() {
        await deleteDoc(newsRef);
        dispatch("deleted", {
            ref: newsRef
        });
    }

    const idBase = "" + Math.ceil(Math.random() * 10000);

    let modified: boolean = false;

    $: {
        let h = imageUrl + imageCopyright + dateString;

        Object.values(text).forEach((v) => {
            h += v.title + v.content
        });
        modified = hash !== h;
    };
</script>

<div class="editor-container" class:modified={modified}>
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img src={imageUrl} alt="Image thumbnail" class="img" />

    <div class="url">
        <div>{imageUrl}</div>
        {#if imageUploadProgress >= 0}
            <div>Uploading image ({imageUploadProgress}%)</div>
        {:else}
            <label class="custom-file-upload cta-inverted">
                <input type="file" accept="image/*" bind:this={imageInput} on:change={uploadImage} />
                Upload image
            </label>
        {/if}
    </div>
    
    <label for="{idBase}-copyright" class="copyright-label">Copyright</label>
    <input type="text" id="{idBase}-copyright" class="copyright-field" bind:value={imageCopyright} />

    <label for="{idBase}-date" class="date-label">Date</label>
    <input type="date" id="{idBase}-date" class="date-field" bind:value={dateString} />

    <div class="texts">
        {#each Object.keys(text) as lang}
            <NewsContentEditor langName={lang} text={text[lang]} />
        {/each}
    </div>

    <div class="delete-button">
        <button on:click={deleteNews}>Delete news</button>
    </div>
</div>

<style>
    .editor-container {
        grid-template-areas:
            "img url delete-button"
            "img copyright-label delete-button"
            "img copyright-field delete-button"
            "img date-label delete-button"
            "img date-field delete-button"
            "texts texts delete-button";
        
        grid-template-columns: 200px 1fr 10rem;
        grid-template-rows: repeat(min-content);
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

    .img {
        grid-area: img;
        display: block;
        max-width: 100%;
        max-height: 100%;
    }

    .url {
        grid-area: url;
    }

    .copyright-label {
        grid-area: copyright-label;
    }

    .copyright-field {
        grid-area: copyright-field;
    }

    .date-label {
        grid-area: date-label;
    }

    .date-field {
        grid-area: date-field;
    }

    .texts {
        grid-area: texts;
    }

</style>