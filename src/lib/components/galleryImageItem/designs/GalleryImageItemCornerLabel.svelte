<script lang="ts">
    import type { GalleryImageItemDesignProps } from "../galleryImageItem";

    let { preview }: GalleryImageItemDesignProps = $props();
</script>

<img
    src={preview.src}
    alt=""
    loading="lazy"
    decoding="async"
    class="transition-scale reduce-motion reduce-scale block h-full w-full object-cover object-center group-hover:scale-105"
/>
<span class="absolute right-0 bottom-0 max-w-[85%] bg-primary-dark px-4 py-3 text-right text-xs font-semibold text-white">
    &#169; {preview.credit}
</span>
