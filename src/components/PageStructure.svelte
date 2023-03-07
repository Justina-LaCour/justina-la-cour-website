<script lang="ts">
    export let title: string = "";
    export let bgImgName: string = "home_bg.jpg";
    export let bgPosition: string = "90%";
    export let imgName: string = "";
    export let imgAlt: string = "Justina La Cour";
    export let layout: "image-left" | "image-right" | "content-only" = "image-left";
</script>

<svelte:head>
    <title>Justina La Cour - {title}</title>
</svelte:head>

<main style="background-image: url(/imgs/{bgImgName}); background-position: {bgPosition};">
    <h1>{ title }</h1>
    <div class="page-content backdrop-blur-very-strong bg-very-dark">
        <div class="grid {layout}">
            {#if layout !== "content-only"}
                <div class="picture">
                    <img src="/imgs/{imgName}" alt="{imgAlt}" />
                </div>
            {/if}
            <div class="content">
                <slot />
            </div>
        </div>
    </div>
</main>

<style>
    main {
        padding-top: 30rem;

        background-size: cover;
    }

    .page-content {
        padding: 1rem;
        box-shadow: 0 -7rem 3rem 2rem rgba(255, 255, 255, 0.5);
    }

    .grid {
        display: grid;
        gap: 1rem;
    }
    
    .grid.image-left {
        grid-template-columns: 1fr 2fr;
        grid-template-areas: "picture content";
    }

    .grid.image-right {
        grid-template-columns: 2fr 1fr;
        grid-template-areas: "content picture";
    }

    .grid.content-only {
        grid-template-columns: 1fr;
        grid-template-areas: "content";
    }

    @media screen and (max-width: 35rem) {
        .grid.image-left, .grid.image-right {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr min-content;
            grid-template-areas:
                "content"
                "picture";
        }
    }

    .picture {
        grid-area: picture;
    }
    
    .picture img {
        width: 100%;
    }

    .content {
        grid-area: content;
    }

    h1 {
        position: relative;
        z-index: 10;
        margin-left: 5vw;
    }
</style>