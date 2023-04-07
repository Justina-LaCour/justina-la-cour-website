<script lang="ts">
    import { news } from "../../stores/news";
    import type { News } from "../../types/news";
    import NewsModal from "../modals/NewsModal.svelte";

    export let maxCount: number = -1;
    export let lang: string = "en";

    let modal: NewsModal;

    function openNews(n: News) {
        modal.show(n);
    }

    function keyDown(e: KeyboardEvent, n: News) {
        if (e.key === "Enter") {
            openNews(n);
        }
    }

    $: truncatedNews = maxCount < 0 ? $news.news : $news.news.slice(0, maxCount);
</script>

<div class="auto-grid">
    {#each truncatedNews as newsItem}
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div class="news" style="background-image: url('{newsItem.imageUrl}');" tabindex="0" on:keydown={(e) => {keyDown(e, newsItem);}} on:click={() => {openNews(newsItem);}}>
            <div class="overlay">
                <div class="bottom">
                    <h4>{ newsItem.text[lang].title }</h4>
                    <h5>{ newsItem.date.toLocaleDateString() }</h5>
                </div>
            </div>
        </div>
    {/each}

    <NewsModal lang={lang} bind:this={modal} />
</div>

<style>

    .auto-grid {
        --cell-width: 16rem;
        --cell-height: 24rem;

        gap: 2rem;

        margin-bottom: 3rem;
    }

    .news {
        position: relative;

        width: var(--cell-width);
        height: var(--cell-height);

        background-size: cover;
        background-position: center;

        overflow: hidden;

        cursor: pointer;

        border-radius: 2rem;

        transition: 0.25s;
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8));

        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        padding: 1rem;
    }

    h4 {
        margin: 0;
        margin-bottom: 0.5rem;
        font-size: 1.25rem;
    }

    h5 {
        font-weight: normal;
        margin: 0;
    }

    .auto-grid:has(:hover) > :not(:hover) {
        opacity: 0.5;
        transform: scale(0.95);
    }

    .news:hover {
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.25);
    }

</style>