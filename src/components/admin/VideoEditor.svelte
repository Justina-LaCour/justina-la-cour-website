<script lang="ts">

    import { type DocumentReference, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
    import { onMount, createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let videoRef: DocumentReference;

    let youtubeHandle: string = "";
    let title: string = "";
    let date: Date = new Date();

    let hash: string = "";

    onMount(async () => {
        const snapshot = await getDoc(videoRef);
        const data = snapshot.data();
        if (!data) return;

        youtubeHandle = data.youtubeHandle;
        title = data.title;
        date = data.addedDate.toDate();

        hash = youtubeHandle + title;
    });

    export async function save() {
        if (!modified) return;

        const data = {
            youtubeHandle,
            title,
            date
        };
        await updateDoc(videoRef, data);
        hash = youtubeHandle + title;
    }

    async function deletePicture() {
        await deleteDoc(videoRef);
        dispatch("deleted", {
            ref: videoRef
        });
    }

    const idBase = "" + Math.ceil(Math.random() * 10000);

    $: modified = hash !== (youtubeHandle + title);
</script>

<div class="editor-container" class:modified={modified}>
    <iframe class="yt-video youtube-preview" width="560" height="315" src="https://www.youtube.com/embed/{youtubeHandle}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    
    <div class="youtube-handle">
        <label for="{idBase}-youtube-handle" class="youtube-handle-label">Youtube handle (youtube.com/watch?v=YOUTUBE_HANDLE)</label>
        <input type="text" id="{idBase}-youtube-handle" class="youtube-handle-field" bind:value={youtubeHandle} />
        <div class="info">The YouTube handle is the string of random characters that identifies the YouTube video, and can be found in the YouTube page URL after this part: youtube.com/watch?v=</div>
    </div>
    <div class="title">
        <label for="{idBase}-title" class="title-label">Title</label>
        <input type="text" id="{idBase}-title" class="title-field" bind:value={title} />
    </div>

    <div class="added">
        Added on <br />
        { date.toLocaleDateString() }
    </div>

    <div class="delete-button">
        <button on:click={deletePicture}>Delete video</button>
    </div>
</div>

<style>

    .editor-container {
        grid-template-areas:
            "youtube-preview youtube-handle delete-button"
            "youtube-preview title delete-button"
            "youtube-preview added delete-button";
        
        grid-template-columns: 560px 1fr 10rem;
        grid-template-rows: min-content min-content;
    }

    .youtube-preview {
        grid-area: youtube-preview;
        display: block;
        max-width: 100%;
        max-height: 100%;
    }

    .youtube-handle {
        grid-area: youtube-handle;
    }

    .title {
        grid-area: title;
    }

    .added {
        grid-area: added;
    }


    .info {
        font-style: italic;
        font-size: 0.8rem;
    }
</style>