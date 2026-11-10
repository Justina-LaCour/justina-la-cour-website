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
        getPageStructureTransitionNames("simple-two-columns", config.layout)
    );
</script>

<div
    class="page-structure {config.layout}"
    style="--lg-header-image-min-height: {config.lgHeaderImageMinHeight}; --mobile-header-height: {config.mobileHeaderHeight}; --banner-vt: {transitionNames.banner}; --title-vt: {transitionNames.title}; --content-vt: {transitionNames.content};"
>
    {#if config.layout !== "content-only" && config.bannerImage}
        <PageStructureBanner
            image={config.bannerImage}
            photoCredits={config.bannerPhotoCredits}
            position={config.bannerPosition}
            mobilePosition={config.bannerMobilePosition}
            class="split-banner"
        />
    {/if}

    <main id="main-content" tabindex="-1">
        <div class="page-content bg-surface py-8 px-4 md:px-8 lg:py-32">
            <div class="title-group">
                {#if backTo}
                    <a
                        class="transition-ui reduce-motion mt-8 mb-8 inline-flex items-center gap-2 font-semibold text-primary no-underline hover:text-primary-dark hover:underline lg:mt-0"
                        href={backTo.url}
                    >
                        <span aria-hidden="true">←</span>
                        {backTo.text}
                    </a>
                {/if}
                <h1
                    class="font-heading text-page-title text-primary-dark"
                    class:compact-title={config.titleSize === "compact"}
                >{title}</h1>
                {#if subtitle || subtitleActions}
                    <div class="title-bar">
                        <div>
                            {#if subtitle}
                                <div class="subtitle text-page-subtitle">{subtitle}</div>
                            {/if}
                        </div>
                        {@render subtitleActions?.()}
                    </div>
                {/if}
            </div>

            <div class="grid">
                <div class="content">
                    {@render children?.()}
                </div>
            </div>
        </div>
    </main>
</div>

<style>
    .page-structure {
        padding-top: 3rem;
    }

    .page-content {
        container-type: inline-size;
        container-name: page-content;
    }

    @media screen and (width > 1024px) {
        .page-structure {
            display: grid;
            padding-top: 0;
        }

        .page-structure.image-left {
            grid-template-areas: "picture main";
            grid-template-columns: min(40rem, 50vw) 1fr;
        }

        .page-structure.image-right {
            grid-template-areas: "main picture";
            grid-template-columns: 1fr min(40rem, 50vw);
        }

        .page-structure.content-only {
            grid-template-areas: "main";
            grid-template-columns: 1fr;
        }

        .page-structure :global(.split-banner) {
            position: sticky !important;
            top: 0;
            height: 100svh !important;
            min-height: var(--lg-header-image-min-height);
        }

        .page-content {
            min-height: max(100svh, var(--lg-header-image-min-height));
        }
    }

    @container page-content (min-width: 600px) {
        .title-bar {
            flex-direction: row !important;
            justify-content: space-between;
            align-items: center;
        }
    }

    .page-structure :global(.split-banner) {
        grid-area: picture;
        position: relative;
        height: var(--mobile-header-height);
        view-transition-name: var(--banner-vt);
    }

    main {
        grid-area: main;
    }

    .title-bar {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 3rem;
    }

    h1 {
        margin: 0 0 3rem;
        min-width: 0;
        overflow-wrap: anywhere;
    }

    h1.compact-title {
        font-size: var(--text-page-title-compact);
    }

    .title-group {
        view-transition-name: var(--title-vt);
    }

    .content {
        view-transition-name: var(--content-vt);
    }

    @container page-content (min-width: 600px) {
        h1 {
            font-size: var(--text-page-title-wide);
        }

        h1.compact-title {
            font-size: var(--text-page-title-compact-wide);
        }
    }

    ::view-transition-group(simple-two-columns-banner-image-left),
    ::view-transition-group(simple-two-columns-banner-image-right) {
        z-index: 0;
    }

    ::view-transition-new(simple-two-columns-banner-image-left),
    ::view-transition-new(simple-two-columns-banner-image-right) {
        animation: image-enter-sm var(--transition-duration-fancy) ease-out;
    }

    ::view-transition-new(simple-two-columns-title-image-left),
    ::view-transition-new(simple-two-columns-title-image-right),
    ::view-transition-new(simple-two-columns-title-content-only) {
        animation: title-enter var(--transition-duration-fancy) ease-out;
    }

    ::view-transition-new(simple-two-columns-content-image-left),
    ::view-transition-new(simple-two-columns-content-image-right),
    ::view-transition-new(simple-two-columns-content-content-only) {
        opacity: 0;
        animation: title-enter var(--transition-duration-fancy) ease-out 0.25s forwards;
    }

    @media screen and (width > 1024px) {
        ::view-transition-new(simple-two-columns-banner-image-left),
        ::view-transition-new(simple-two-columns-banner-image-right) {
            animation: image-enter-lg var(--transition-duration-fancy) ease-out;
        }
    }

    @keyframes image-enter-lg {
        0% {
            opacity: 0;
            transform: translateX(0.25rem);
        }
        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes image-enter-sm {
        0% {
            opacity: 0;
            transform: translateY(0.25rem);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes title-enter {
        0% {
            opacity: 0;
            transform: translateY(0.5rem);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
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
