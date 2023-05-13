<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { NewsContent } from "../../../types/news";

    const dispatch = createEventDispatcher();

    export let text: NewsContent;
    export let langName: string;

    const idBase = "" + Math.ceil(Math.random() * 10000);

    function emitChanged() {
        dispatch("changed");
    }

</script>

<div>
    <h3>{ langName }</h3>

    <label for="{idBase}-title" class="title-label">Title</label>
    <input type="text" id="{idBase}-title" class="title-field" bind:value={text.title} on:input={emitChanged} />
    
    <label for="{idBase}-content" class="content-label">Content</label>
    <textarea id="{idBase}-content" class="content-field" cols="8" bind:value={text.content} on:input={emitChanged} />
</div>