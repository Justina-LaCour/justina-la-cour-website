<script lang="ts">
    import "@fontsource-variable/montserrat/wght.css";
    import "@fontsource-variable/montserrat/wght-italic.css";
    import "@fontsource/aboreto";
    import "../app.css";
    import { beforeNavigate, onNavigate } from "$app/navigation";
    import LoadingSpinner from "$lib/components/utils/LoadingSpinner.svelte";
    import { onMount } from "svelte";
    import { prefersReducedMotion } from "svelte/motion";
    import { fade } from "svelte/transition";

    let { children } = $props();

    onMount(() => {
        document.body.classList.add("first-page", "animated");

        // A page restored from the browser's back/forward cache keeps its
        // previous Svelte state. Never restore it with the loading overlay on.
        window.addEventListener("pageshow", navigationEnd);
        window.addEventListener("pagehide", navigationEnd);

        return () => {
            window.removeEventListener("pageshow", navigationEnd);
            window.removeEventListener("pagehide", navigationEnd);
        };
    });

    let showLoading = $state<boolean>(false);
    let timer: ReturnType<typeof setTimeout> | undefined;

    function navigationEnd() {
        clearTimeout(timer);
        timer = undefined;
        showLoading = false;
    }

    beforeNavigate((navigation) => {
        if (navigation.type === "leave") {
            return;
        }

        timer = setTimeout(() => {
            showLoading = true;
        }, 100);
    });

    onNavigate(async (navigation) => {
        document.body.classList.remove("first-page");

        // onNavigate only runs for client-side SvelteKit navigations. Starting
        // the timer here avoids activating it when the browser leaves the site.
        navigationEnd();

        if (!document.startViewTransition) {
            navigation.complete.then(navigationEnd, navigationEnd);
            return;
        }

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();
                try {
                    await navigation.complete;
                } finally {
                    navigationEnd();
                }
            });
        });
    });
</script>

<svelte:head>
    <link rel="icon" href="/favicon.png" type="image/png" sizes="96x96" />
</svelte:head>
{@render children?.()}
{#if showLoading}
    <div
        class="fixed z-10000 top-0 left-0 w-screen h-screen bg-background/80 flex justify-center items-center"
        transition:fade={{ duration: prefersReducedMotion.current ? 0 : 500 }}
    >
        <LoadingSpinner />
    </div>
{/if}
