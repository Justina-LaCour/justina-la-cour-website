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
<div class="transition reduce-motion absolute inset-x-0 bottom-0 translate-y-2 bg-linear-to-t from-black/85 via-black/50 to-transparent px-5 pt-14 pb-4 text-sm text-white opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
    <span class="font-semibold">&#169; {preview.credit}</span>
</div>
