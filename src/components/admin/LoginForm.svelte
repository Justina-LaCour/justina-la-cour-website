<script lang="ts">
    import { onMount } from "svelte";
    import { adminUser } from "../../firebase/stores";

    let login: () => void;

    onMount(async () => {
        const { signIn }  = await import("../../firebase");

        login = async () => {
            try {
                await signIn(email, password);
                email = "";
                password = "";
            } catch (err) {
                error = "An error has occured";
                console.log(err);
                password = "";
            }
        }
    });

    let email: string = "";
    let password: string = "";
    let error: string = "";

</script>

<form on:submit|preventDefault={login}>
    <label for="email">Email</label>
    <input type="email" name="email" id="email" bind:value={email} />
    <label for="password">Password</label>
    <input type="password" name="password" id="password" bind:value={password} />
    <p class="error">{ error }</p>
    <button>Login</button>
</form>

<style>
    form {
        max-width: 400px;
        width: 100%;
        margin: auto;
    }

    input {
        display: block;
        font: inherit;
        width: 100%;
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }
</style>