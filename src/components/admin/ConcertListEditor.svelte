<script lang="ts">
    import { onMount } from "svelte";
    import { addDoc, type CollectionReference, type DocumentReference } from "firebase/firestore";
    import ConcertEditor from "./ConcertEditor.svelte";
    import LoadingSpinner from "../utils/LoadingSpinner.svelte";

    let concertsRefs: DocumentReference[] = [];

    let concertsCol: CollectionReference | null = null;

    let saving: boolean = false;

    onMount(async () => {
        const { getConcerts, concertsCollection }  = await import("../../firebase");
        concertsCol = concertsCollection;
        concertsRefs = (await getConcerts()).docs.map((d) => d.ref);
    });

    let singleEditors: ConcertEditor[] = [];

    async function save() {
        saving = true;

        const promises = [];

        for (const editor of singleEditors) {
            promises.push(editor.save());
        }

        await Promise.all(promises);

        saving = false;
    }

    async function addConcert() {
        if (!concertsCol) return;

        const docRef = await addDoc(concertsCol, {
            location: "",
            description: "",
            date: new Date(),
            url: ""
        });

        concertsRefs = [...concertsRefs, docRef];
    }

    function onDelete(event: any) {
        concertsRefs = concertsRefs.filter((ref) => ref !== event.detail.ref);
    }

</script>

<div class="editor-wrapper">
    <div class="toolbar">
        <button on:click={addConcert}>Add concert</button>
        <button on:click={save}>Save</button>
    </div>

    {#if saving}
        <div class="saving-backdrop">
            <LoadingSpinner message="Saving gallery..." />
        </div>
    {:else}
        {#each concertsRefs as concert, i}
            <ConcertEditor concertRef={concert} bind:this={singleEditors[i]} on:deleted={onDelete} />
        {/each}
    {/if}
</div>
