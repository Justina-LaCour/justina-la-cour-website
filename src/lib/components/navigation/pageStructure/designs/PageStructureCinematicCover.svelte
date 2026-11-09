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
        getPageStructureTransitionNames("cinematic-cover", config.layout)
    );
</script>

<div
    class="page-structure {config.layout}"
    style="--cover-height-mobile: {config.mobileHeaderHeight}; --cover-height-desktop: {config.lgHeaderImageMinHeight}; --banner-vt: {transitionNames.banner}; --title-vt: {transitionNames.title}; --content-vt: {transitionNames.content};"
>
    <header class:has-image={config.layout !== "content-only" && !!config.bannerImage}>
        {#if config.layout !== "content-only" && config.bannerImage}
            <PageStructureBanner
                image={config.bannerImage}
                photoCredits={config.bannerPhotoCredits}
                position={config.bannerPosition}
                mobilePosition={config.bannerMobilePosition}
                class="cover-banner"
            />
            <div class="scrim"></div>
        {/if}

        <div class="title-group">
            <h1
                class="font-heading text-page-title"
                class:compact-title={config.titleSize === "compact"}
            >{title}</h1>
            {#if subtitle}
                <div class="subtitle text-page-subtitle">{subtitle}</div>
            {/if}
            {#if subtitleActions}
                <div class="actions">{@render subtitleActions()}</div>
            {/if}
        </div>
    </header>

    <main id="main-content" tabindex="-1">
        <div class="page-content bg-background">
            <div class="content">
                {#if backTo}
                    <a
                        class="transition-ui reduce-motion mb-7 inline-flex items-center gap-2 font-semibold text-primary no-underline hover:text-primary-dark hover:underline"
                        href={backTo.url}
                    >
                        <span aria-hidden="true">←</span>
                        {backTo.text}
                    </a>
                {/if}
                {@render children?.()}
            </div>
        </div>
    </main>
</div>

<style>
    .page-structure {
        background: var(--color-background);
    }

    header {
        position: relative;
        display: grid;
        min-height: 22rem;
        overflow: hidden;
        background: var(--color-primary-dark);
        color: white;
        isolation: isolate;
        view-transition-name: var(--banner-vt);
    }

    header.has-image {
        min-height: var(--cover-height-mobile);
    }

    header :global(.cover-banner),
    .scrim {
        position: absolute;
        inset: 0;
    }

    header :global(.cover-banner) {
        z-index: -2;
    }

    .scrim {
        z-index: -1;
        background:
            linear-gradient(to top, rgb(0 0 0 / 0.78), transparent 70%),
            linear-gradient(to right, rgb(0 0 0 / 0.28), transparent 60%);
    }

    .title-group {
        align-self: end;
        width: min(100%, 92rem);
        margin-inline: auto;
        padding: clamp(7rem, 18vh, 12rem) clamp(1.5rem, 5vw, 8rem) clamp(2rem, 6vw, 3rem);
        view-transition-name: var(--title-vt);
    }

    .image-right .title-group {
        text-align: right;
    }

    h1 {
        min-width: 0;
        max-width: min(40ch, 100%);
        margin: 0;
        color: inherit;
        overflow-wrap: anywhere;
    }

    h1.compact-title {
        font-size: var(--text-page-title-compact);
    }

    .image-right h1 {
        margin-left: auto;
    }

    .subtitle {
        max-width: 38rem;
        margin-top: 1.5rem;
    }

    .image-right .subtitle {
        margin-left: auto;
    }

    .actions {
        margin-top: 2rem;
    }

    .page-content {
        container: page-content / inline-size;
        min-height: 50svh;
    }

    .content {
        width: min(100%, 92rem);
        margin-inline: auto;
        padding: clamp(2rem, 8vw, 4rem) clamp(1.5rem, 5vw, 8rem);
        view-transition-name: var(--content-vt);
    }

    @media screen and (width > 1024px) {
        header.has-image {
            min-height: min(88svh, var(--cover-height-desktop));
        }

        h1 {
            font-size: var(--text-page-title-wide);
        }

        h1.compact-title {
            font-size: var(--text-page-title-compact-wide);
        }
    }

    ::view-transition-group(cinematic-cover-banner-image-left),
    ::view-transition-group(cinematic-cover-banner-image-right) {
        z-index: 0;
    }

    ::view-transition-new(cinematic-cover-banner-image-left) {
        animation: image-enter-left var(--transition-duration-fancy) ease-out;
    }

    ::view-transition-new(cinematic-cover-banner-image-right) {
        animation: image-enter-right var(--transition-duration-fancy) ease-out;
    }

    ::view-transition-new(cinematic-cover-title-image-right) {
        opacity: 0;
        animation: title-enter-right var(--transition-duration-fancy) ease-out 0.2s forwards;
    }

    ::view-transition-new(cinematic-cover-title-image-left) {
        opacity: 0;
        animation: title-enter-left var(--transition-duration-fancy) ease-out 0.2s forwards;
    }

    ::view-transition-new(cinematic-cover-title-content-only),
    ::view-transition-new(cinematic-cover-content-image-left),
    ::view-transition-new(cinematic-cover-content-image-right),
    ::view-transition-new(cinematic-cover-content-content-only) {
        opacity: 0;
        animation: content-enter var(--transition-duration-fancy) ease-out 0.3s forwards;
    }

    @keyframes image-enter-right {
        from {
            opacity: 0;
            transform: translateX(0.5rem);
        }
    }

    @keyframes image-enter-left {
        from {
            opacity: 0;
            transform: translateX(-0.5rem);
        }
    }

    @keyframes title-enter-right {
        from {
            opacity: 0;
            transform: translateX(1rem);
        }
    }

    @keyframes title-enter-left {
        from {
            opacity: 0;
            transform: translateX(-1rem);
        }
    }

    @keyframes content-enter {
        from {
            opacity: 0;
            transform: translateY(0.5rem);
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
