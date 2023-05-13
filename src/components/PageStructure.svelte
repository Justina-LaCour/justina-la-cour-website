<script lang="ts">
    export let title: string = "";
    export let bgImgName: string = "ParisGrandPrix_WideShot.jpg";
    export let bgPositionX: string = "70%";
    export let bgPositionY: string = "top";
    export let bgPositionMobileX: string = "70%";
    export let bgPositionMobileY: string = "top";
    export let imgName: string = "";
    export let imgAlt: string = "Justina La Cour";
    export let layout: "image-left" | "image-right" | "content-only" = "image-left";
</script>

<svelte:head>
    <title>Justina La Cour - {title}</title>
</svelte:head>

<main style="--bg-pos-x: {bgPositionX}; --bg-pos-y: {bgPositionY}; --bg-pos-mobile-x: {bgPositionMobileX}; --bg-pos-mobile-y: {bgPositionMobileY};">
    <img class="background" src="/imgs/{bgImgName}" alt={title} />
    <h1>{ title }</h1>
    <div class="page-content backdrop-blur-very-strong bg-very-light">
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
        position: relative;
    }

    .background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        display: block;

        object-fit: cover;
        object-position: var(--bg-pos-x) var(--bg-pos-y);

        z-index: -1;
    }

    .page-content {
        padding: 1rem;
        box-shadow: 0 -7rem 3rem 2rem rgba(255, 255, 255, 0.5);

        opacity: 0;
    }
    
    :global(.animated) .page-content {
        animation: content-appear 0.5s ease-out forwards;
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
        .background {
            object-position: var(--bg-pos-mobile-x) var(--bg-pos-mobile-y);
        }
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
        position: relative;
    }
    
    .picture img {
        width: 100%;
        position: sticky;
        top: 5rem;
    }

    .content {
        grid-area: content;
    }

    h1 {
        position: relative;
        z-index: 10;
        margin-left: 5vw;

        opacity: 0;
    }
    
    :global(.animated) h1 {
        animation: title-appear 0.6s ease-out 0.2s forwards;
    }
</style>