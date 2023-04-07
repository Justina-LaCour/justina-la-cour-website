<script lang="ts">
    import { onMount } from 'svelte';
    import Nav from '../../components/nav/Nav.svelte';
    import SocialLinks from "../../components/utils/SocialLinks.svelte";
    import LoginForm from "../../components/admin/LoginForm.svelte";
    import PageStructure from "../../components/PageStructure.svelte";
    import NavLink from "../../components/utils/NavLink.svelte";
    import { adminUser } from "../../firebase/stores";
    import "../../styles/admin.css";
    import "../../styles/global.css";

    $: title = $adminUser ? `Admin (${$adminUser.email})` : "Admin (login)";

    onMount(() => {
        document.body.classList.add("animated"); // Prevents animation flashing with SSR
    });

</script>

<Nav />
<PageStructure layout="content-only" title={title}>
    {#if $adminUser}
        <div>
            <nav class="admin-nav">
                <NavLink href="/admin">Analytics</NavLink>
                <NavLink href="/admin/bio">Edit Bios</NavLink>
                <NavLink href="/admin/socialmedias">Edit Social Medias</NavLink>
                <NavLink href="/admin/news">Edit News</NavLink>
                <NavLink href="/admin/concerts">Edit Concerts</NavLink>
                <NavLink href="/admin/videos">Edit Videos</NavLink>
                <NavLink href="/admin/gallery">Edit Gallery</NavLink>
                <NavLink href="/admin/postgenerator">Post generator</NavLink>
            </nav>

            <slot />
        </div>
    {:else}
    <div class="center">
        <LoginForm />
    </div>
    {/if}
</PageStructure>
<footer>
    Justina La Cour
    <SocialLinks />
</footer>

<style>
    .center {
        margin: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    nav {
        display: flex;
        gap: 1rem;
    }

    .admin-nav :global(a) {
        color: black;
    }
</style>