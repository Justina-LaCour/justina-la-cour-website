<script lang="ts">
    import SocialLinks from "../utils/SocialLinks.svelte";
    import SmartConcertList from "../concerts/SmartConcertList.svelte";
    import { bios } from "../../stores/bios";
    import LoadingSpinner from "../utils/LoadingSpinner.svelte";
    import { Status } from "../../types/status";
    import { browser } from "$app/environment";

    export let instrument: string = "Violinist";
    export let aboutTitle: string = "About Justina";
    export let language: string = "en";
    export let bioLoadingText: string = "Loading bio";
    export let seeBioText: string = "See Biography";
    export let listenTitle: string = "Listen";
    export let seeMedias: string = "See Medias";
    export let concertsTitle: string = "Concerts";
    export let seeAllConcertsText: string = "See All Concerts";
    export let seeGalleryText: string = "See Gallery";

    if (browser) {
        setTimeout(() => {
            document.body.classList.add("no-home-animation");
        }, 2000);
    }
    
</script>

<svelte:head>
    <title>Justina La Cour - Home</title>
</svelte:head>

<div id="home-wrapper">
    <div id="home-bg" />
    <section class="splash">
        <div class="text">
            <h1 class="name">Justina La Cour</h1>
            <h2 class="instrument">{instrument}</h2>
            <SocialLinks />
        </div>
    </section>

    <div class="grid bg-light">
        <section class="mini-bio backdrop-blur-very-strong bg-very-light">
            <h3>{ aboutTitle }</h3>

            {#if $bios[language].status === Status.PENDING}
                <LoadingSpinner message={bioLoadingText} />
            {:else}
                <p class="line-breaks">{ $bios[language].biography.short }</p>
            {/if}
            
            <a href="{language}/bio" class="cta">{ seeBioText }</a>
        </section>
        
        <section class="main-media backdrop-blur-very-strong bg-very-light">
            <h3>{ listenTitle }</h3>
            <iframe class="yt-video" width="560" height="315" src="https://www.youtube.com/embed/1V7yLJOhuV8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <a href="{language}/media" class="cta-inverted">{ seeMedias }</a>
        </section>
    
        <section class="concerts backdrop-blur-very-strong bg-very-light">
            <h3>{ concertsTitle }</h3>
            <SmartConcertList mode="upcoming" maxCount={5} />
            <a href="{language}/concerts" class="cta">{ seeAllConcertsText }</a>
        </section>
        
        <section class="gallery backdrop-blur-very-strong bg-very-light">
            <div class="gallery-backdrop">
                <a href="{language}/media" class="cta-inverted">{ seeGalleryText }</a>
            </div>
        </section>
    </div>
</div>

<style>

    #home-wrapper {
        position: relative;
    }
    
    #home-bg {
        position: fixed;
        height: 100vh;
        width: 100%;
        z-index: -1;

        background-image: url("/imgs/ParisGrandPrix_WideShot.jpg");
        background-size: cover;
        background-position: 70%;

        opacity: 0;
    }
    
    :global(.animated) #home-bg {
        animation: zoom-out 0.75s ease-out forwards;
    }

    :global(.animated.no-home-animation) #home-bg {
        opacity: 1;
        animation: none;
    }

    section {
        padding: min(2rem, 5vw);
        box-sizing: border-box;

        transition: 0.2s ease;
    }

    .splash {
        position: relative;
        z-index: 1;
        min-height: 100vh;
    }

    .splash .text {
        position: absolute;
        top: 6rem;
        border-radius: 2rem;

        color: white;

        opacity: 0;
    }
    
    .animated .splash .text {
        animation: title-appear 0.6s ease-out 0.6s forwards;
    }

    :global(.animated.no-home-animation) .splash .text {
        animation-delay: 0.2s;
    }

    .name {
        font-size: min(4rem, 15vw);
        text-shadow: 0 0 3rem rgba(0, 0, 0, 1), 0 0 1rem rgba(0, 0, 0, 1);
        margin-bottom: 0.5rem;
    }

    .instrument {
        font-size: min(3rem, 12vw);
        text-shadow: 0 0 3rem rgba(0, 0, 0, 1), 0 0 1rem rgba(0, 0, 0, 1);
        margin-top: 1rem;
    }
    
    @media screen and (max-width: 55rem) {
        .splash .text {
            top: unset;
            bottom: 2rem;
        }
    }

    .grid {
        display: grid;

        opacity: 0;
        box-shadow: 0 -2rem 2rem 2rem rgba(0, 0, 0, 0.4);
    }
    
    .animated #home-wrapper .grid {
        animation: bottom-appear 0.5s ease-out 0.8s forwards;
    }
    
    :global(.animated.no-home-animation) #home-wrapper .grid {
        animation-delay: 0.4s;
    }

    h3 {
        margin-top: 0;
        text-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.25);
    }

    section img {
        display: block;
        width: 100%;
    }

    .main-media {
        background-color: var(--color-primary-light);
    }

    .gallery {
        background-image: url("/imgs/Portrait1.jpg");
        background-size: cover;
        background-position: center;
        padding: 0;
        height: 40rem;
    }

    .gallery-backdrop {
        background-color: var(--color-primary-light);
        min-height: 15rem;
        height: 100%;
        box-sizing: border-box;
        padding: 2rem;

        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
    }
</style>