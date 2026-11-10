<script lang="ts">
    import LazyImage, {
        type LazyImageAsset
    } from "$lib/components/images/LazyImage.svelte";

    interface Props {
        title: string;
        tagline: string;
        image: LazyImageAsset;
        imageAlt?: string;
        photoCredit?: string;
    }

    let {
        title,
        tagline,
        image,
        imageAlt = "",
        photoCredit
    }: Props = $props();
</script>

<section class="simple-hero relative h-svh min-h-154 overflow-hidden">
    <div
        class="simple-hero-copy absolute z-1 inset-0 px-6 pt-32 pb-16 flex flex-col justify-end xl:left-0 xl:justify-start"
    >
        <h1
            class="m-0 max-w-5xl font-heading text-[clamp(1.875rem,9.5vw,3.75rem)] lg:text-7xl leading-none text-white text-shadow-lg"
        >
            {title}
        </h1>
        <p
            class="simple-hero-tagline mt-2 max-w-2xl font-heading text-lg sm:text-2xl text-white/90 text-shadow-sm"
        >
            {tagline}
        </p>
    </div>

    <LazyImage
        src={image.src}
        lowresSrc={image.lowresSrc}
        lowresFilter={image.lowresFilter}
        sources={image.sources}
        sizes={image.sizes}
        alt={imageAlt}
        loading="eager"
        fetchpriority="high"
        class="absolute inset-0 block h-full w-full object-cover object-left-bottom md:object-[center_80%] simple-hero-image"
    />
    {#if photoCredit}
        <p class="absolute bottom-3 right-6 z-2 m-0 text-xs text-white text-shadow-sm">© {photoCredit}</p>
    {/if}
</section>

<style>
    .simple-hero {
        --copy-height: clamp(13rem, 34vh, 21rem);
    }

    .simple-hero-copy {
        background: linear-gradient(
            to top,
            rgb(0 0 0 / 0.9),
            rgb(0 0 0 / 0.65) var(--copy-height),
            transparent calc(var(--copy-height) * 1.8)
        );
        opacity: 0;
        animation: copy-appear var(--transition-duration-fancy) ease-out 0.3s forwards;
    }

    .simple-hero-tagline {
        opacity: 0;
        animation: tagline-appear var(--transition-duration-fancy) ease-out 0.4s forwards;
    }

    :global(.simple-hero-image) {
        animation: image-appear var(--transition-duration-fancy) ease-out;
    }

    @media (min-width: 1280px) {
        .simple-hero-copy {
            background: linear-gradient(
                160deg,
                rgb(0 0 0 / 0.9) 5rem,
                rgb(0 0 0 / 0.65) 20rem,
                transparent 27rem
            );
        }
    }

    @keyframes copy-appear {
        from {
            opacity: 0.25;
            transform: translateY(1rem);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes tagline-appear {
        from {
            opacity: 0.25;
            transform: translateY(0.25rem);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes image-appear {
        from {
            opacity: 0.25;
            transform: scale(1.05);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .simple-hero-copy,
        .simple-hero-tagline,
        :global(.simple-hero-image) {
            opacity: 1;
            transform: none;
            animation: none;
        }
    }
</style>
