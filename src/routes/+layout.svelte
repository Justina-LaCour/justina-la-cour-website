<script>
    import Nav from '../components/Nav.svelte';
    import SocialLinks from "../components/SocialLinks.svelte";
    import { updateConcerts } from "../stores/concerts";
    import "../styles/global.css";

    updateConcerts();
</script>

<Nav />
<slot />
<footer>
    Justina La Cour
    <SocialLinks />
</footer>

<style>
    footer {
        position: relative; /* allows to go on top of shadows */
        background-color: rgb(51, 51, 51);
        color: white;
        padding: 2rem;
    }
</style>