<script lang="ts">

    import { onMount } from "svelte";
    import { addDoc, type CollectionReference, type DocumentReference } from "firebase/firestore";
    import SingleNewsEditor from "../../../components/admin/news/SingleNewsEditor.svelte";
    import LoadingSpinner from "../../../components/utils/LoadingSpinner.svelte";
    import type { News } from "../../../types/news";
    
    let newsCol: CollectionReference | null = null;

    let newsRefs: DocumentReference[] = [];

    let singleEditors: SingleNewsEditor[] = [];

    let saving: boolean = false;

    onMount(async () => {
        const { newsCollection, getNews }  = await import("../../../firebase");
        newsCol = newsCollection;
        newsRefs = (await getNews()).docs.map((d) => d.ref);
    });

    async function addNews() {
        if (!newsCol) return;

        const docRef = await addDoc(newsCol, {
            imageUrl: "/imgs/gallery_default.jpg",
            imageCopyright: "",
            date: new Date(),
            text: {
                en: {
                    title: "",
                    content: ""
                },
                fr: {
                    title: "",
                    content: ""
                }
            }
        } as News);

        newsRefs = [...newsRefs, docRef];
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
        newsRefs = newsRefs.filter((ref) => ref !== event.detail.ref);
    }

</script>

<div>
    <h2>Edit News</h2>

    <div class="editor-wrapper">
        <div class="toolbar">
            <button on:click={addNews}>Add news</button>
            <button on:click={save}>Save</button>
        </div>
    
        {#if saving}
            <div class="saving-backdrop">
                <LoadingSpinner message="Saving news..." />
            </div>
        {:else}
            {#each newsRefs as news, i}
                <SingleNewsEditor newsRef={news} bind:this={singleEditors[i]} on:deleted={onDelete} />
            {/each}
        {/if}
    </div>
</div>