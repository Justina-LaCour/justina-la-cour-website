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
<div class="absolute top-5/8 h-3/8 left-0 w-full bg-linear-to-b from-transparent to-black/90"></div>
<span class="absolute inset-x-5 bottom-4 border-t border-white/65 pt-3 text-xs font-semibold tracking-widest text-white drop-shadow-md uppercase">
    &#169; {preview.credit}
</span>
