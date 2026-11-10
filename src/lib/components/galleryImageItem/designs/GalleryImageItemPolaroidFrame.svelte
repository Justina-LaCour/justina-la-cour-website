<script lang="ts">
    import type { GalleryImageItemDesignProps } from "../galleryImageItem";

    let { preview }: GalleryImageItemDesignProps = $props();
</script>

<div class="flex h-full flex-col bg-white p-3 pb-4 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)] sm:p-4 sm:pb-5">
    <div class="min-h-0 flex-1 overflow-hidden bg-black/5">
        <img
            src={preview.src}
            alt=""
            loading="lazy"
            decoding="async"
            class="transition-scale reduce-motion reduce-scale block h-full w-full object-cover object-center group-hover:scale-105"
        />
    </div>
    <p class="m-0 truncate pt-3 text-center text-xs tracking-wide text-primary-dark">
        &#169; {preview.credit}
    </p>
</div>
