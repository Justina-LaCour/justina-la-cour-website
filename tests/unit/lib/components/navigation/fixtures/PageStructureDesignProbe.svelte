<script lang="ts">
    import type { PageStructureDesignProps } from "$lib/components/navigation/pageStructure/pageStructure";

    let { backTo, config }: PageStructureDesignProps = $props();
</script>

<span
    data-mobile-header-height={config.mobileHeaderHeight}
    data-desktop-header-min-height={config.lgHeaderImageMinHeight}
    data-title-size={config.titleSize}
></span>

{#if backTo}
    <a href={backTo.url}>{backTo.text}</a>
{/if}
