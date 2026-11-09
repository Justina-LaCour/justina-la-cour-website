<script lang="ts">
    import { site } from "$lib/config/config";

    interface Props {
        status: number;
        pageTitle: string;
        title: string;
        description: string;
        homeLabel: string;
        retryLabel: string;
        homeHref: string;
    }

    let {
        status,
        pageTitle,
        title,
        description,
        homeLabel,
        retryLabel,
        homeHref
    }: Props = $props();
</script>

<svelte:head>
    <title>{pageTitle} - {site.identity.name}</title>
    <meta name="robots" content="noindex" />
</svelte:head>

<main
    id="main-content"
    tabindex="-1"
    class="grid min-h-[70svh] place-items-center bg-background px-6 py-24"
>
    <section
        class="w-full max-w-xl rounded-2xl bg-surface p-8 text-center shadow-xl sm:p-12"
        aria-labelledby="error-title"
    >
        <p class="mb-3 text-sm font-bold tracking-[0.2em] text-muted uppercase">
            {status}
        </p>
        <h1
            id="error-title"
            class="font-heading text-4xl text-primary-dark sm:text-5xl"
        >
            {title}
        </h1>
        <p class="mx-auto mt-5 max-w-md text-lg leading-relaxed">{description}</p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
            {#if status >= 500}
                <button
                    type="button"
                    class="transition-ui reduce-motion rounded-full border border-primary-dark bg-primary-dark px-6 py-2 text-white hover:bg-white hover:text-primary-dark"
                    onclick={() => window.location.reload()}
                >
                    {retryLabel}
                </button>
            {/if}
            <a
                href={homeHref}
                class="transition-ui reduce-motion rounded-full border border-primary-dark bg-white px-6 py-2 text-primary-dark no-underline hover:bg-primary-dark hover:text-white"
            >
                {homeLabel}
            </a>
        </div>
    </section>
</main>
