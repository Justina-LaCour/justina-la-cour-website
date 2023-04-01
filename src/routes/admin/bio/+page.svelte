<script lang="ts">

    import { onMount } from "svelte";
    import type { CollectionReference, DocumentReference } from "firebase/firestore";
    import BioEditor from "../../../components/admin/BioEditor.svelte";
    import LoadingSpinner from "../../../components/utils/LoadingSpinner.svelte";
    
    let biosCol: CollectionReference | null = null;
    let biosRefs: DocumentReference[] = [];

    let saving: boolean = false;

    onMount(async () => {
        const { biosCollection, getBios }  = await import("../../../firebase");
        biosCol = biosCollection;

        biosRefs = (await getBios()).docs.map((d) => d.ref);
    });

    let singleEditors: BioEditor[] = [];

    async function save() {
        saving = true;

        const promises = [];

        for (const editor of singleEditors) {
            promises.push(editor.save());
        }

        await Promise.all(promises);

        saving = false;
    }

</script>

<div>
    <h2>Edit Biographies</h2>

    <div class="editor-wrapper">
        <div class="toolbar">
            <button on:click={save}>Save</button>
        </div>
    
        {#if saving}
            <div class="saving-backdrop">
                <LoadingSpinner message="Saving gallery..." />
            </div>
        {:else}
            {#each biosRefs as bio, i}
                <BioEditor bioRef={bio} bind:this={singleEditors[i]} />
            {/each}
        {/if}
    </div>
</div>