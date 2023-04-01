<script lang="ts">

    export let message: string = "";

</script>


<div class="spinner">
    <div class="lds-dual-ring"></div>

    {#if message}
        <p class="message">{ message }</p>
    {/if}
</div>

<style>

    .spinner {
        --color: rgba(0, 0, 0, 0.4);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .lds-dual-ring {
        display: inline-block;
        width: 80px;
        height: 80px;
    }

    .lds-dual-ring:after {
        content: " ";
        display: block;
        width: 64px;
        height: 64px;
        margin: 8px;
        border-radius: 50%;
        border: 6px solid var(--color);
        border-color: var(--color) transparent var(--color) transparent;
        animation: lds-dual-ring 1.2s linear infinite;
    }

    .message {
        color: var(--color);
    }

    @keyframes lds-dual-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

</style>