<script lang="ts">
    import { onMount } from "svelte";
    import PageStructure from "../../components/PageStructure.svelte";
    /*import { adminUser } from "../firebase/stores";
    import LoginForm from "../components/admin/LoginForm.svelte";
    import ConcertListEditor from "../components/admin/ConcertListEditor.svelte";

    onMount(async () => {
        const { signIn }  = await import("../firebase");
    });

    $: title = $adminUser ? `Admin (${$adminUser.email})` : "Admin (login)";*/

    let title = "as";

</script>

<PageStructure layout="content-only" title={title}>
    <!--
    {#if $adminUser}
        <div>
            <h2>Concerts</h2>
            <ConcertListEditor />
        </div>
    {:else}
        <div class="center">
            <LoginForm />
        </div>
    {/if}
    -->
</PageStructure>

<style>
    .center {
        margin: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>