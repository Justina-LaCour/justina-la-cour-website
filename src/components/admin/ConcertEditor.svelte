<script lang="ts">

    import { type DocumentReference, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
    import { onMount, createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let concertRef: DocumentReference;

    let location: string = "";
    let description: string = "";
    let dateString: string = "";

    let hash: string = "";

    onMount(async () => {
        const snapshot = await getDoc(concertRef);
        const data = snapshot.data();
        if (!data) return;

        location = data.location;
        description = data.description;
        dateString = data.date.toDate().toISOString().split("T")[0];

        hash = location + description + dateString;
    });

    export async function save() {
        if (!modified) return;

        const data = {
            location,
            description,
            date: new Date(dateString)
        };
        await updateDoc(concertRef, data);
        hash = location + description + dateString;
    }

    async function deleteConcert() {
        await deleteDoc(concertRef);
        dispatch("deleted", {
            ref: concertRef
        });
    }

    const idBase = "" + Math.ceil(Math.random() * 10000);

    $: modified = hash !== (location + description + dateString);
</script>

<div class="container" class:modified={modified}>
    <label for="{idBase}-date" class="date-label">Date</label>
    <input type="date" id="{idBase}-date" class="date-field" bind:value={dateString} />
    <label for="{idBase}-location" class="location-label">Location</label>
    <input type="text" id="{idBase}-location" class="location-field" bind:value={location}>
    <label for="{idBase}-description" class="description-label">Description</label>
    <textarea id="{idBase}-description" class="description-field" cols="4" bind:value={description} />

    <div class="delete-button">
        <button on:click={deleteConcert}>Delete concert</button>
    </div>
</div>

<style>
    .modified {
        outline: 1px solid red;
    }

    .container {
        padding: 0.5rem;
        display: grid;

        grid-template-areas:
            "date-label location-label delete-button"
            "date-field location-field delete-button"
            "description-label . delete-button"
            "description-field description-field delete-button";
        
        grid-template-columns: 1fr 2fr 10rem;
        gap: 0.5rem 1rem;

        transition: 0.2s;

        margin-bottom: 1rem;
        border-left: 0.5rem solid var(--color-primary-light);
    }
    .container:hover {
        background-color: rgb(0, 0, 0, 0.08);
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

    .delete-button {
        grid-area: delete-button;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
</style>