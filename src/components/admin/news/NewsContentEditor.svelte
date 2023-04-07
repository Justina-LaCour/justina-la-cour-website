<script lang="ts">

    import type { NewsContent } from "../../../types/news";

    export let text: NewsContent;
    export let langName: string;

    const idBase = "" + Math.ceil(Math.random() * 10000);

</script>

<div>
    <h3>{ langName }</h3>

    <label for="{idBase}-title" class="title-label">Title</label>
    <input type="text" id="{idBase}-title" class="title-field" bind:value={text.title} />
    
    <label for="{idBase}-content" class="content-label">Content</label>
    <textarea id="{idBase}-content" class="content-field" cols="8" bind:value={text.content} />
</div>