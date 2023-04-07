<script lang="ts">
    import type { News } from "../../types/news";
    import Modal from "./Modal.svelte";
    
    export let lang: string = "en";

    let news: News = {
        imageUrl: "",
        imageCopyright: "",
        text: {
            [lang]: {
                title: "",
                content: ""
            },
        },
        date: new Date()
    };

    let modal: Modal;

    export function show(newsItem: News) {
        news = newsItem;
        modal.show();
    }
</script>

<Modal bind:this={modal}>
    <div slot="left-button"></div>

    <div>
        <img src={news.imageUrl} alt={news.text[lang].title} />
        <div class="text">
            <h3>{ news.text[lang].title }</h3>
            <p>{ news.text[lang].content }</p>
        </div>
    </div>
</Modal>

<style>

    img {
        display: block;
        width: 100%;
        object-fit: cover;
        max-width: min(90vw, 800px);
        max-height: 400px;
    }

    .text {
        background: rgba(255, 255, 255, 0.5);
        padding: 0.75rem;
    }

</style>