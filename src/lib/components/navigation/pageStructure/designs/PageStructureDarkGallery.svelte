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
        getPageStructureTransitionNames("dark-gallery", config.layout)
    );
</script>

<div
    class="page-structure {config.layout}"
    style="--gallery-height-mobile: {config.mobileHeaderHeight}; --gallery-height-desktop: {config.lgHeaderImageMinHeight}; --banner-vt: {transitionNames.banner}; --title-vt: {transitionNames.title}; --content-vt: {transitionNames.content};"
>
    <header class="gallery-masthead">
        <div class="title-group px-6 pt-8 pb-4">
            {#if backTo}
                <a
                    class="transition-ui reduce-motion mb-7 inline-flex items-center gap-2 text-sm font-bold tracking-widest text-white/75 uppercase no-underline hover:text-white hover:underline"
                    href={backTo.url}
                >
                    <span aria-hidden="true">←</span>
                    {backTo.text}
                </a>
            {/if}
            <h1
                class="font-heading text-page-title"
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
            <div class="gallery-frame">
                <PageStructureBanner
                    image={config.bannerImage}
                    photoCredits={config.bannerPhotoCredits}
                    position={config.bannerPosition}
                    mobilePosition={config.bannerMobilePosition}
                    class="gallery-banner"
                />
            </div>
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
        background: var(--color-primary-dark);
        color: white;
    }

    .gallery-masthead {
        display: grid;
        gap: 2rem;
        width: min(100%, 94rem);
        margin-inline: auto;
    }

    .title-group {
        view-transition-name: var(--title-vt);
    }

    h1 {
        max-width: 10ch;
        margin: 0;
        color: white;
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
        color: rgb(255 255 255 / 0.82);
    }

    .gallery-frame {
        padding: 0.75rem;
        border: 1px solid rgb(255 255 255 / 0.28);
        background: rgb(255 255 255 / 0.05);
        box-shadow: 0 1.5rem 4rem rgb(0 0 0 / 0.34);
    }

    .gallery-frame :global(.gallery-banner) {
        height: min(var(--gallery-height-mobile), 68svh);
        view-transition-name: var(--banner-vt);
    }

    main {
        position: relative;
        z-index: 2;
        width: min(100%, 80rem);
        margin: -1.5rem auto 0;
        color: var(--color-foreground);
    }

    .page-content {
        container: page-content / inline-size;
        min-height: 45svh;
        padding: clamp(3rem, 8vw, 8rem) clamp(1rem, 6vw, 6rem);
        box-shadow: 0 1.5rem 4rem rgb(0 0 0 / 0.22);
    }

    .content {
        view-transition-name: var(--content-vt);
    }

    @media screen and (width > 1024px) {
        .page-structure {
            padding: 4rem clamp(2rem, 5vw, 6rem) 5rem;
        }

        .gallery-masthead {
            grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
            align-items: center;
            gap: clamp(2rem, 5vw, 6rem);
            width: min(100%, 94rem);
            min-height: var(--gallery-height-desktop);
        }

        .image-left .gallery-masthead {
            grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
        }

        .image-left .title-group {
            grid-column: 2;
        }

        .image-left .gallery-frame {
            grid-column: 1;
            grid-row: 1;
        }

        .content-only .gallery-masthead {
            display: block;
            width: min(100%, 76rem);
            min-height: auto;
            padding-block: 4rem;
        }

        .title-group {
            padding: 0;
        }

        h1 {
            font-size: clamp(3.25rem, 4.5vw, 5rem);
        }

        h1.compact-title {
            font-size: clamp(2.75rem, 4vw, var(--text-page-title-compact-wide));
        }

        .title-bar {
            align-items: flex-start;
        }

        .gallery-frame {
            padding: 1rem;
        }

        .gallery-frame :global(.gallery-banner) {
            height: min(calc(100svh - 12rem), var(--gallery-height-desktop));
            min-height: 34rem;
        }

        main {
            width: min(100%, 80rem);
            margin-top: -2.5rem;
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
