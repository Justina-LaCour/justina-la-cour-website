<script module lang="ts">
    import type { Picture } from "@sveltejs/enhanced-img";

    import type { LazyImageInput, LazyImageSource } from "./imageTypes";
    export type { LazyImageInput, LazyImageSource, LazyImageAsset } from "./imageTypes";
</script>

<script lang="ts">
    interface Props {
        src: LazyImageInput;
        lowresSrc?: string;
        sources?: readonly LazyImageSource[];
        sizes?: string;
        alt?: string;
        width?: number;
        height?: number;
        lowresBlurRadius?: string;
        lowresFilter?: string;
        loading?: "eager" | "lazy";
        fetchpriority?: "high" | "low" | "auto";
        decoding?: "sync" | "async" | "auto";
        onFullResLoaded?: () => void;
        onFullResError?: () => void;
        fullResLoaded?: boolean;
        objectPosition?: string;

        class?: string;
    }

    let {
        src,
        lowresSrc,
        sources = [],
        sizes,
        alt = "",
        width,
        height,
        lowresBlurRadius = "15px",
        lowresFilter = "none",
        loading = "lazy",
        fetchpriority = "auto",
        decoding = "async",
        onFullResLoaded,
        onFullResError,
        fullResLoaded = $bindable(false),
        objectPosition,
        class: imgClass = "",
    }: Props = $props();

    // The cached-image check and the browser event can observe the same request.
    // Track its URL so each public callback runs only once per request.
    let loadedSrc: string | undefined;
    let failedSrc: string | undefined;

    function isPicture(input: LazyImageInput): input is Picture {
        return typeof input !== "string";
    }

    function resolveImageDimensions(
        input: LazyImageInput,
        requestedWidth?: number,
        requestedHeight?: number,
    ) {
        if (!isPicture(input)) {
            return { width: requestedWidth, height: requestedHeight };
        }

        const aspectRatio = input.img.w / input.img.h;

        if (requestedWidth !== undefined) {
            return {
                width: requestedWidth,
                height:
                    requestedHeight ?? Math.round(requestedWidth / aspectRatio),
            };
        }

        if (requestedHeight !== undefined) {
            return {
                width: Math.round(requestedHeight * aspectRatio),
                height: requestedHeight,
            };
        }

        return { width: input.img.w, height: input.img.h };
    }

    const dimensions = $derived(resolveImageDimensions(src, width, height));
    const resolvedLowresFilter = $derived(
        lowresFilter === "none"
            ? `blur(${lowresBlurRadius})`
            : `blur(${lowresBlurRadius}) ${lowresFilter}`
    );

    function handleFullResLoaded(image: HTMLImageElement) {
        const currentSrc = image.currentSrc || image.src;
        if (loadedSrc === currentSrc) return;

        loadedSrc = currentSrc;
        fullResLoaded = true;
        onFullResLoaded?.();
    }

    function handleFullResError(image: HTMLImageElement) {
        const currentSrc = image.currentSrc || image.src;
        if (failedSrc === currentSrc) return;

        failedSrc = currentSrc;
        onFullResError?.();
    }

    function trackFullResLoad(container: HTMLElement) {
        const image = container.querySelector("img");
        if (!image) return;

        const handleLoad = () => handleFullResLoaded(image);
        const handleError = () => handleFullResError(image);
        image.addEventListener("load", handleLoad);
        image.addEventListener("error", handleError);

        // A cached image can finish before the action attaches its listener.
        if (image.complete) {
            if (image.naturalWidth > 0) {
                handleLoad();
            } else {
                handleError();
            }
        }

        return {
            destroy() {
                image.removeEventListener("load", handleLoad);
                image.removeEventListener("error", handleError);
            },
        };
    }
</script>

<span
    class="lazy-image {imgClass}"
    style="--lowres-filter: {resolvedLowresFilter}"
    style:--image-object-position={objectPosition}
>
    {#if lowresSrc}
        <picture class="low-res" aria-hidden="true">
            {#each sources as source}
                {#if source.lowresSrc}
                    <source
                        media={source.media}
                        srcset={source.lowresSrc}
                    />
                {/if}
            {/each}
            <img
                src={lowresSrc}
                alt=""
                width={dimensions.width}
                height={dimensions.height}
                {loading}
                decoding="async"
            />
        </picture>
    {/if}

    <picture class="full-res" use:trackFullResLoad>
        {#each sources as source}
            {@const sourceInput = source.src}
            {#if isPicture(sourceInput)}
                {#each Object.entries(sourceInput.sources) as [format, srcset]}
                    <source
                        media={source.media}
                        type="image/{format}"
                        {srcset}
                        sizes={source.sizes ?? sizes}
                    />
                {/each}
            {:else}
                <source
                    media={source.media}
                    type={source.type}
                    srcset={sourceInput}
                    sizes={source.sizes ?? sizes}
                />
            {/if}
        {/each}
        {#if isPicture(src)}
            {#each Object.entries(src.sources) as [format, srcset]}
                <source type="image/{format}" {srcset} {sizes} />
            {/each}
        {/if}
        <img
            src={isPicture(src) ? src.img.src : src}
            class:loaded={fullResLoaded}
            {alt}
            width={dimensions.width}
            height={dimensions.height}
            {loading}
            {fetchpriority}
            {decoding}
        />
    </picture>
</span>

<style>
    .lazy-image {
        position: relative;
        isolation: isolate;
        display: inline-block;
        overflow: hidden;
        line-height: 0;
    }

    picture {
        display: contents;
        min-width: inherit;
        min-height: inherit;
        max-width: inherit;
        max-height: inherit;
        object-fit: inherit;
        object-position: inherit;
    }

    img {
        display: block;
        width: 100%;
        height: 100%;
        min-width: inherit;
        min-height: inherit;
        max-width: inherit;
        max-height: inherit;
        object-fit: inherit;
        object-position: var(--image-object-position, inherit);
    }

    .low-res img {
        position: absolute;
        inset: 0;
        z-index: 0;
        filter: var(--lowres-filter);
        transform: scale(1.02);
    }

    .full-res img {
        position: relative;
        z-index: 1;
        opacity: 0.01;
        transition: opacity var(--transition-duration-fancy);
    }

    .full-res img.loaded {
        opacity: 1;
    }
</style>
