<script lang="ts">
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
        getPageStructureTransitionNames("floating-portrait", config.layout)
    );
</script>

<div
    class="page-structure {config.layout}"
    style="--portrait-height-mobile: {config.mobileHeaderHeight}; --portrait-height-desktop: {config.lgHeaderImageMinHeight}; --banner-vt: {transitionNames.banner}; --title-vt: {transitionNames.title}; --content-vt: {transitionNames.content};"
>
    <div class="shell">
        {#if config.layout !== "content-only" && config.bannerImage}
            <aside>
                <PageStructureBanner
                    image={config.bannerImage}
                    photoCredits={config.bannerPhotoCredits}
                    position={config.bannerPosition}
                    mobilePosition={config.bannerMobilePosition}
                    class="portrait-banner"
                />
            </aside>
        {/if}

        <main id="main-content" tabindex="-1">
            <div class="page-content bg-background">
                <header class="title-group">
                    {#if backTo}
                        <a
                            class="transition-ui reduce-motion mb-8 inline-flex items-center gap-2 font-semibold text-primary no-underline hover:text-primary-dark hover:underline"
                            href={backTo.url}
                        >
                            <span aria-hidden="true">←</span>
                            {backTo.text}
                        </a>
                    {/if}
                    <span class="rule"></span>
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
                </header>

                <div class="content">{@render children?.()}</div>
            </div>
        </main>
    </div>
</div>

<style>
    .page-structure {
        --portrait-height-mobile: 28rem;
        --space-top-mobile: 4rem;

        position: relative;
        min-height: 100svh;
        padding: var(--portrait-height-mobile) 0 0;
        background: var(--color-surface);
    }

    aside {
        position: absolute;
        top: var(--space-top-mobile);
        left: 1rem;
        z-index: 1;
        width: calc(100% - 2rem);
        max-height: var(--portrait-height-mobile);
        margin: auto;
        box-shadow: 0 1rem 1.5rem rgb(0 0 0 / 0.15);
    }

    aside :global(.portrait-banner) {
        height: min(var(--portrait-height-mobile), 72svh);
        view-transition-name: var(--banner-vt);
    }

    .image-left main {
        margin-right: auto;
    }

    .image-right main {
        margin-left: auto;
    }

    .content-only main {
        width: 100%;
        margin: 0;
    }

    .page-content {
        container: page-content / inline-size;
        padding: calc(var(--space-top-mobile) + 2rem) clamp(1.5rem, 6vw, 6rem) clamp(3rem, 7vw, 7rem);
        box-shadow: 0 0 1rem rgb(0 0 0 / 0.15);
    }

    .title-group {
        margin-bottom: clamp(3rem, 7vw, 6rem);
        view-transition-name: var(--title-vt);
    }

    .rule {
        display: block;
        width: 4rem;
        height: 0.3rem;
        margin-bottom: 2rem;
        background: var(--color-primary);
    }

    h1 {
        max-width: 11ch;
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
        margin-top: 1.5rem;
    }

    .subtitle {
        max-width: 34rem;
    }

    .content {
        view-transition-name: var(--content-vt);
    }

    @media screen and (width > 1024px) {
        .shell {
            width: min(100%, 104rem);
            margin-inline: auto;
            padding-bottom: 3rem;
        }

        .page-structure {
            padding: 6rem clamp(2rem, 5vw, 4rem) 4rem;
        }

        .shell {
            display: grid;
            grid-template-columns: minmax(22rem, 0.72fr) minmax(0, 1.28fr);
            align-items: start;
            padding: 0;
        }

        .image-right .shell {
            grid-template-columns: minmax(0, 1.28fr) minmax(22rem, 0.72fr);
        }

        aside {
            max-height: unset;
            box-shadow: 0 1rem 2.5rem rgb(0 0 0 / 0.25);
        }

        aside,
        .image-right aside {
            position: sticky;
            top: 6rem;
            width: auto;
            margin: 3rem -2rem 0 0;
        }

        .image-right aside {
            grid-column: 2;
            margin: 3rem 0 0 -2rem;
        }

        aside :global(.portrait-banner) {
            height: min(calc(100svh - 12rem), var(--portrait-height-desktop));
            min-height: 34rem;
        }

        main#main-content {
            margin-bottom: 4rem;
        }

        main,
        .image-right main {
            grid-column: 2;
            grid-row: 1;
            min-width: 0;
            width: auto;
            margin: 0;
        }

        .image-right main {
            grid-column: 1;
        }

        .content-only .shell {
            display: block;
            width: min(100%, 76rem);
        }

        .page-content {
            min-height: calc(100svh - 12rem);
            padding-top: clamp(5rem, 8vw, 9rem);
        }

        h1 {
            font-size: var(--text-page-title-wide);
        }

        h1.compact-title {
            font-size: var(--text-page-title-compact-wide);
        }

        .title-bar {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
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
