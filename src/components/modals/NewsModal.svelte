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

    <div class="content">
        <img src={news.imageUrl} alt={news.text[lang].title} class="main-image" />
        <div class="text">
            <h3>{ news.text[lang].title }</h3>
            <p>{ news.text[lang].content }</p>
        </div>
    </div>
</Modal>

<style>
    .content {
        display: flex;
        width: 70vw;
    }

    @media screen and (max-width: 35rem) {
        .content {
            display: block;
            width: 90vw;
        }

        .main-image {
            max-height: 50vh;
            max-width: unset;
        }
    }
    
    img {
        display: block;
        width: 100%;
        object-fit: cover;
        object-position: top;
        max-width: min(90vw, 400px);
    }

    .text {
        background: rgba(255, 255, 255, 0.5);
        padding: 0.75rem;
    }

</style>