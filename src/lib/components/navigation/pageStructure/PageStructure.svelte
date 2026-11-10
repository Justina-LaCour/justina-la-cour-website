<script lang="ts">
    import OpenGraph from "$lib/components/utils/OpenGraph.svelte";
    import { defaultPageStructureConfig } from "$lib/config/pageStructure";
    import { site } from "$lib/config/config";
    import type { LazyImageAsset } from "$lib/components/images/LazyImage.svelte";
    import type {
        PageStructureConfig,
        PageStructureDesignConfig,
        PageStructureProps
    } from "./pageStructure";

    let {
        title = "",
        subtitle,
        backTo,
        config: customConfig = {},
        ogDescription,
        metadataTitle,
        ogTitle = site.identity.titleSuffix,
        ogImageUrl,
        children,
        subtitleActions
    }: PageStructureProps = $props();

    function getImageUrl(image: LazyImageAsset | undefined) {
        if (!image) return undefined;
        return typeof image.src === "string" ? image.src : image.src.img.src;
    }

    const config = $derived<PageStructureConfig>({
        ...defaultPageStructureConfig,
        ...customConfig
    });
    const Design = $derived(config.design);
    const designConfig = $derived.by<PageStructureDesignConfig>(() => {
        const { design: _design, ...resolvedDesignConfig } = config;
        return {
            ...resolvedDesignConfig,
            bannerPhotoCredits: config.showBannerPhotoCredits === false
                ? undefined
                : config.bannerPhotoCredits
        };
    });
    const resolvedImageUrl = $derived(
        ogImageUrl ?? config.openGraphImage ?? getImageUrl(config.bannerImage)
    );
</script>

<OpenGraph
    title={metadataTitle ?? `${title}${ogTitle}`}
    description={ogDescription}
    imageUrl={resolvedImageUrl}
/>

<Design
    {title}
    {subtitle}
    {backTo}
    config={designConfig}
    {children}
    {subtitleActions}
/>
