<script lang="ts">

    import { type DocumentReference, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
    import { onMount, createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let concertRef: DocumentReference;

    let location: string = "";
    let description: string = "";
    let dateString: string = "";
    let url: string = "";

    let hash: string = "";

    onMount(async () => {
        const snapshot = await getDoc(concertRef);
        const data = snapshot.data();
        if (!data) return;

        location = data.location;
        description = data.description;
        dateString = data.date.toDate().toISOString().split("T")[0];
        url = data.url ?? "";

        hash = location + description + dateString + url;
    });

    export async function save() {
        if (!modified) return;

        const data = {
            location,
            description,
            date: new Date(dateString),
            url
        };
        await updateDoc(concertRef, data);
        hash = location + description + dateString + url;
    }

    async function deleteConcert() {
        await deleteDoc(concertRef);
        dispatch("deleted", {
            ref: concertRef
        });
    }

    const idBase = "" + Math.ceil(Math.random() * 10000);

    $: modified = hash !== (location + description + dateString + url);
</script>

<div class="editor-container" class:modified={modified}>
    <label for="{idBase}-date" class="date-label">Date</label>
    <input type="date" id="{idBase}-date" class="date-field" bind:value={dateString} />
    <label for="{idBase}-location" class="location-label">Location</label>
    <input type="text" id="{idBase}-location" class="location-field" bind:value={location} />
    
    <label for="{idBase}-description" class="description-label">Description</label>
    <textarea id="{idBase}-description" class="description-field" cols="4" bind:value={description} />

    <label for="{idBase}-url" class="url-label">Website url (optional)</label>
    <input type="url" id="{idBase}-url" class="url-field" bind:value={url} />

    <div class="delete-button">
        <button on:click={deleteConcert}>Delete concert</button>
    </div>
</div>

<style>

.editor-container {
        grid-template-areas:
            "date-label location-label delete-button"
            "date-field location-field delete-button"
            "description-label . delete-button"
            "description-field description-field delete-button"
            "url-label url-label delete-button"
            "url-field url-field delete-button";
        
        grid-template-columns: 1fr 2fr 10rem;
        grid-template-rows: min-content min-content min-content 8rem min-content min-content;
    }

    input, textarea {
        display: block;
        font: inherit;
    }

    .date-label {
        grid-area: date-label;
    }

    .date-field {
        grid-area: date-field;
    }

    .location-label {
        grid-area: location-label;
    }

    .location-field {
        grid-area: location-field;
    }

    .description-label {
        grid-area: description-label;
    }

    .description-field {
        grid-area: description-field;
    }

    .url-label {
        grid-area: url-label;
    }

    .url-field {
        grid-area: url-field;
    }
</style>