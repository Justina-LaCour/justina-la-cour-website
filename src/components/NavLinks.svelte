<script lang="ts">
    import NavLink from "./NavLink.svelte";

    export let vertical = false;
</script>

<ul class="links" class:vertical={vertical}>
    <li><NavLink href="/">Home</NavLink></li>
    <li><NavLink href="/bio">Bio</NavLink></li>
    <li><NavLink href="/concerts">Concerts</NavLink></li>
    <li><NavLink href="/media">Media</NavLink></li>
    <li><NavLink href="/contact">Contact</NavLink></li>
</ul>

<style>
    .links {
        list-style-type: none;
        display: flex;
        gap: 1rem;
        padding: 0;
        margin: 0;
    }

    .links.vertical {
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>