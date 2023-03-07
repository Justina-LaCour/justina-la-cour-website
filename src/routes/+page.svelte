<script>
    import SocialLinks from "../components/SocialLinks.svelte";
    import SmartConcertList from "../components/SmartConcertList.svelte";
    import NewsList from "../components/NewsList.svelte";
</script>

<svelte:head>
    <title>Justina La Cour - Home</title>
</svelte:head>

<div id="home-wrapper">
    <div id="home-bg" />
    <section class="splash">
        <!-- <div class="backdrop backdrop-blur-strong bg-dark"></div> -->
        <div class="text">
                <h1 class="name">Justina La Cour</h1>
                <h2 class="instrument">Violin</h2>
                <SocialLinks />
        </div>
    </section>

    <div class="grid bg-dark">
        <section class="mini-bio backdrop-blur-very-strong bg-very-dark">
            <div class="horizontal-main-left">
                <div>
                    <h3>About Justina</h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto nesciunt maxime animi, rerum dolorum reiciendis ratione sapiente facere, eius officiis, tempora fugit! Rem blanditiis sint nulla placeat id adipisci possimus, numquam fugit nostrum exercitationem commodi voluptatibus quae tempora autem minus ducimus quam velit facere maiores ipsa amet, officia eum culpa.</p>
                    
                    <a href="/bio" class="cta">See Biography</a>
                </div>
                <div>
                    <img src="/imgs/ParisGrandPrix_CloseShot2.jpeg" alt="Justina La Cour" />
                </div>
            </div>
        </section>
        
        <section class="main-media backdrop-blur-very-strong bg-very-dark">
            <h3>Listen</h3>
            <iframe class="yt-video" width="560" height="315" src="https://www.youtube.com/embed/L-h1Q_FNMQc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <a href="/media" class="cta-inverted">See Medias</a>
        </section>
    
        <section class="concerts backdrop-blur-very-strong bg-very-dark">
            <h3>News</h3>
            <NewsList />
            <a href="/concerts" class="cta">See All News</a>
        </section>

        <section class="concerts backdrop-blur-very-strong bg-very-dark">
            <h3>Concerts</h3>
            <SmartConcertList mode="upcoming" maxCount={5} />
            <a href="/concerts" class="cta">See All Concerts</a>
        </section>
        
        <section class="gallery backdrop-blur-very-strong bg-very-dark">
            <div class="gallery-backdrop">
                <a href="/media" class="cta-inverted">See Gallery</a>
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
        background-position: 90%;
    }

    section {
        padding: min(4rem, 5vw);
        color: white;
        box-sizing: border-box;
    }

    .splash {
        position: relative;
        min-height: 100vh;
        background: linear-gradient(to bottom left, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0) 60%);
    }

    .splash .text {
        position: absolute;
        text-align: right;
        right: 2rem;
        top: 6rem;
        border-radius: 2rem;

        color: white;
    }

    .name {
        font-size: min(4rem, 15vw);
        text-shadow: 0 0 3rem rgba(0, 0, 0, 1), 0 0 1rem rgba(0, 0, 0, 1), 0 0 0.5rem rgba(0, 0, 0, 1);
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
        box-shadow: 0 -2rem 2rem 2rem rgba(0, 0, 0, 0.4);
    }

    h3 {
        margin-top: 0;
        text-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.25);
    }

    section img {
        display: block;
        width: 100%;
    }

    .mini-bio {
        grid-area: bio;
    }

    .main-media {
        grid-area: media;
        background-color: var(--color-primary-light);
    }

    .concerts {
        grid-area: concerts;
    }

    .gallery {
        grid-area: gallery;
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