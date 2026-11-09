<script lang="ts">
    import Biography from "$lib/components/Biography.svelte";
    import { bioBanner } from "$lib/assets/images/bio";
    import PageStructure from "$lib/components/navigation/pageStructure/PageStructure.svelte";
    import { useI18n } from "$lib/i18n/i18n.svelte";

    let { data } = $props();
    const i18n = useI18n();
</script>

<PageStructure
    title={i18n.t("bio.title")}
    ogDescription={i18n.t("og.bioDescription")}
    config={{
        bannerImage: bioBanner,
        openGraphImage: bioBanner.openGraphSrc,
        bannerMobilePosition: "center top"
    }}
>
    <Biography contentHtml={data.bioHtml} />
</PageStructure>
