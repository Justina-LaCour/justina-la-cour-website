<script lang="ts">
    import { site } from "$lib/config/config";
    import PageStructureBanner from "../PageStructureBanner.svelte";
    import type { PageStructureDesignProps } from "../pageStructure";
    import { getPageStructureTransitionNames } from "../pageStructureTransitions";

    let {
        title,
        subtitle,
        backTo,
        config,
        children,
        subtitleActions
    }: PageStructureDesignProps = $props();

    const transitionNames = $derived(
        getPageStructureTransitionNames("layered-poster", config.layout)
    );
</script>

<div
    class="page-structure {config.layout}"
    style="--poster-height-mobile: {config.mobileHeaderHeight}; --poster-height-desktop: {config.lgHeaderImageMinHeight}; --banner-vt: {transitionNames.banner}; --title-vt: {transitionNames.title}; --content-vt: {transitionNames.content};"
>
    <header class="poster-shell">
        <div class="graphic-plane" aria-hidden="true"></div>

        <div class="title-panel">
            {#if backTo}
                <a
                    class="transition-ui reduce-motion mb-7 inline-flex items-center gap-2 text-sm font-bold tracking-wider text-primary uppercase no-underline hover:text-primary-dark hover:underline"
                    href={backTo.url}
                >
                    <span aria-hidden="true">←</span>
                    {backTo.text}
                </a>
            {/if}
            <p class="eyebrow">{site.identity.name}</p>
            <h1
                class="font-heading text-page-title text-primary-dark"
                class:compact-title={config.titleSize === "compact"}
            >{title}</h1>
            {#if subtitle || subtitleActions}
                <div class="title-bar">
                    {#if subtitle}
                        <div class="subtitle text-page-subtitle">{subtitle}</div>
                    {/if}
                    {@render subtitleActions?.()}
                </div>
            {/if}
        </div>

        {#if config.layout !== "content-only" && config.bannerImage}
            <PageStructureBanner
                image={config.bannerImage}
                photoCredits={config.bannerPhotoCredits}
                position={config.bannerPosition}
                mobilePosition={config.bannerMobilePosition}
                class="poster-banner"
            />
        {/if}
    </header>

    <main id="main-content" tabindex="-1">
        <div class="page-content bg-background">
            <div class="content">{@render children?.()}</div>
        </div>
    </main>
</div>

<style>
    .page-structure {
        min-height: 100svh;
        padding-top: 5rem;
        overflow: hidden;
        background: var(--color-surface);
    }

    .poster-shell {
        position: relative;
        display: grid;
        width: min(calc(100% - 2rem), 94rem);
        margin-inline: auto;
        isolation: isolate;
    }

    .graphic-plane {
        position: absolute;
        inset: 1.5rem 0 auto auto;
        z-index: -1;
        width: 42%;
        height: calc(100% - 1.5rem);
        background: var(--color-primary-dark);
    }

    .image-left .graphic-plane {
        right: auto;
        left: 0;
    }

    .content-only .graphic-plane {
        width: 1rem;
    }

    .title-panel {
        position: relative;
        z-index: 2;
        width: calc(100% - 1rem);
        padding: 2.75rem 1.5rem 3.75rem;
        background: var(--color-background);
        box-shadow: 0 1rem 2.5rem rgb(0 0 0 / 0.1);
        view-transition-name: var(--title-vt);
    }

    .image-right .title-panel {
        margin-right: auto;
    }

    .image-left .title-panel {
        margin-left: auto;
    }

    .eyebrow {
        margin: 0 0 1.25rem;
        color: var(--color-muted);
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
    }

    h1 {
        max-width: 10ch;
        margin: 0;
        font-size: clamp(2.75rem, 11vw, var(--text-page-title));
        overflow-wrap: anywhere;
    }

    h1.compact-title {
        font-size: clamp(2.25rem, 9vw, var(--text-page-title-compact));
    }

    .title-bar {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1.5rem;
        margin-top: 2rem;
    }

    .subtitle {
        max-width: 32rem;
    }

    .poster-shell :global(.poster-banner) {
        z-index: 3;
        width: calc(100% - 1rem);
        height: min(var(--poster-height-mobile), 72svh);
        margin-top: -1.5rem;
        box-shadow: 0 1.25rem 3rem rgb(0 0 0 / 0.2);
        view-transition-name: var(--banner-vt);
    }

    .image-right .poster-shell :global(.poster-banner) {
        margin-left: auto;
    }

    .image-left .poster-shell :global(.poster-banner) {
        margin-right: auto;
    }

    main {
        position: relative;
        z-index: 4;
        width: min(calc(100% - 2rem), 80rem);
        margin: -1rem auto 0;
    }

    .page-content {
        container: page-content / inline-size;
        min-height: 40svh;
        padding: clamp(3rem, 8vw, 8rem) clamp(1.5rem, 6vw, 6rem);
        box-shadow: 0 1.5rem 4rem rgb(0 0 0 / 0.08);
    }

    .content {
        view-transition-name: var(--content-vt);
    }

    @media screen and (width > 1024px) {
        .page-structure {
            padding: 8rem clamp(2rem, 5vw, 6rem) 4rem;
        }

        .poster-shell {
            grid-template-columns: minmax(24rem, 0.85fr) minmax(34rem, 1.15fr);
            align-items: center;
            width: min(100%, 94rem);
            min-height: var(--poster-height-desktop);
            padding: 2.5rem 0;
        }

        .image-left .poster-shell {
            grid-template-columns: minmax(34rem, 1.15fr) minmax(24rem, 0.85fr);
        }

        .graphic-plane {
            inset: 0 0 0 auto;
            width: 46%;
            height: 100%;
        }

        .image-left .graphic-plane {
            right: auto;
            left: 0;
        }

        .title-panel {
            grid-column: 1;
            grid-row: 1;
            width: calc(100% + 4rem);
            padding: clamp(4rem, 7vw, 7rem) clamp(3rem, 6vw, 6rem);
        }

        .image-left .title-panel {
            grid-column: 2;
            margin-left: -4rem;
        }

        .poster-shell :global(.poster-banner) {
            grid-column: 2;
            grid-row: 1;
            width: 100%;
            height: min(calc(100svh - 12rem), var(--poster-height-desktop));
            min-height: 34rem;
            margin: 0 0 0 -2rem;
        }

        .image-left .poster-shell :global(.poster-banner) {
            grid-column: 1;
            margin: 0 -2rem 0 0;
        }

        .content-only .poster-shell {
            display: block;
            width: min(100%, 76rem);
            min-height: auto;
        }

        .content-only .title-panel {
            width: 100%;
        }

        h1 {
            max-width: 10ch;
            font-size: clamp(4rem, 5.5vw, 5.5rem);
        }

        h1.compact-title {
            font-size: clamp(3rem, 4.5vw, var(--text-page-title-compact-wide));
        }

        .title-bar {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }

        main {
            width: min(100%, 80rem);
            margin-top: -2rem;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .page-structure {
            --banner-vt: none !important;
            --title-vt: none !important;
            --content-vt: none !important;
        }
    }
</style>
