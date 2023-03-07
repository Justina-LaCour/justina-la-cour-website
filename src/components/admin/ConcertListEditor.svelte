<script lang="ts">
    import type { Concert } from "../../types/concert";
    import { onMount } from "svelte";
    import { adminUser } from "../../firebase/stores";
    import { addDoc, type CollectionReference, type DocumentReference } from "firebase/firestore";
    import ConcertEditor from "./ConcertEditor.svelte";

    let concertsRefs: DocumentReference[] = [];

    let concertsCol: CollectionReference | null = null;

    onMount(async () => {
        const { getConcerts, concertsCollection }  = await import("../../firebase");
        concertsCol = concertsCollection;
        concertsRefs = (await getConcerts()).docs.map((d) => d.ref);
    });

    let singleEditors: ConcertEditor[] = [];

    async function save() {
        const promises = [];

        for (const editor of singleEditors) {
            promises.push(editor.save());
        }

        return Promise.all(promises);
    }

    async function addConcert() {
        if (!concertsCol) return;

        const docRef = await addDoc(concertsCol, {
            location: "",
            description: "",
            date: new Date()
        });

        concertsRefs = [...concertsRefs, docRef];
    }

    function onDelete(event: any) {
        concertsRefs = concertsRefs.filter((ref) => ref !== event.detail.ref);
    }

</script>

<div class="wrapper">
    <div class="toolbar">
        <button on:click={addConcert}>Add concert</button>
        <button on:click={save}>Save</button>
    </div>
    <ul>
        {#each concertsRefs as concert, i}
            <li class="concert-editor">
                <ConcertEditor concertRef={concert} bind:this={singleEditors[i]} on:deleted={onDelete} />
            </li>
        {/each}
    </ul>
</div>

<style>

    .wrapper {
        position: relative;
    }

    ul {
        list-style-type: none;
        margin: 1rem 0;
        padding: 0;
    }

    .toolbar {
        background: white;
        position: sticky;
        top: 4rem;
        padding: 0.5rem;
        box-shadow: 0 2rem 2rem -1rem rgba(0, 0, 0, 0.1);
    }
</style>