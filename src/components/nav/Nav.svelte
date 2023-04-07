<script lang="ts">
    import NavLinks from "./NavLinks.svelte";
    import type { NavLinksParams } from "./NavLinks.svelte";
    import Hamburger from "./Hamburger.svelte";

    export let navParams: NavLinksParams = {
        langURL: "en",
        homeText: "Home",
        bioText: "Bio",
        newsText: "News",
        concertsText: "Concerts",
        mediaText: "Media",
        contactText: "Contact"
    };
</script>

<nav id="nav-wrapper" class="backdrop-blur-strong">
    <div class="logo">Justina La Cour</div>

    <div class="links">
        <NavLinks params={navParams} />
    </div>

    <div class="hamburger">
        <Hamburger navParams={navParams} />
    </div>
</nav>

<style>
    #nav-wrapper {
        padding: 1rem;
        background-color: rgba(0, 0, 0, 0.85);
        color: white;
        position: fixed;
        top: 0;
        z-index: 100;
        width: 100%;
        box-sizing: border-box;

        display: flex;
        justify-content: space-between;
        align-items: center;

        opacity: 0;
    }
    
    :global(.animated) #nav-wrapper {        
        animation: top-appear 0.5s ease-out 0.5s forwards;
    }

    .logo {
        font-family: var(--ff-heading);
        font-size: 1.5rem;
    }

    .links {
        display: none;
    }

    .hamburger {
        position: relative;
        display: block;
    }

    @media screen and (min-width: 50rem) {
        .links {
            display: flex;
        }

        .hamburger {
            display: none;
        }
    }
</style>