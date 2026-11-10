<script lang="ts">
    import { artkytClient } from "$lib/artkyt";
    import Gallery from "$lib/artkyt/components/Gallery.svelte";
    import RecordingPlayer from "$lib/artkyt/components/RecordingPlayer.svelte";
    import { isPlayableRecording } from "$lib/artkyt/constants/externalPlatforms";
    import type { ArtkytImage, Pagination } from "$lib/artkyt/types";
    import { mediaBanner } from "$lib/assets/images/media";
    import { GalleryImageItemCaptionReveal } from "$lib/components/galleryImageItem/designs";
    import type { GalleryImageItemRenderContext } from "$lib/components/galleryImageItem/galleryImageItem";
    import GalleryModal from "$lib/components/modals/GalleryModal.svelte";
    import PageStructure from "$lib/components/navigation/pageStructure/PageStructure.svelte";
    import PaginatedList from "$lib/components/PaginatedList.svelte";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
    let galleryModal: GalleryModal;
    const i18n = useI18n();

    function loadMoreRecordings(pagination: Pagination) {
        return artkytClient.getRecordingsList({ lang: data.lang, pagination });
    }

    function handleImageClick(image: ArtkytImage) {
        galleryModal.show(image);
    }
</script>

{#snippet galleryImageLegend(preview: GalleryImageItemRenderContext)}
    <GalleryImageItemCaptionReveal {preview} />
{/snippet}

<div class="media-page">
    <PageStructure
        title={i18n.t("gallery.title")}
        ogDescription={i18n.t("og.galleryDescription")}
        config={{ layout: "content-only", openGraphImage: mediaBanner.openGraphSrc }}
    >
        <div class="mx-auto max-w-6xl space-y-16">
            <section class="space-y-8">
                <h2 class="text-section-title text-primary-dark">{i18n.t("gallery.recordings")}</h2>
                <PaginatedList
                    initialData={data.recordings}
                    loadMore={loadMoreRecordings}
                    class="grid grid-cols-1 gap-10 md:grid-cols-2"
                >
                    {#snippet children(recording)}
                        {#if isPlayableRecording(recording)}
                            <article class="grid gap-4 md:row-span-2 md:grid-rows-subgrid">
                                <RecordingPlayer platform={recording.platform} url={recording.url} />
                                <div class="space-y-2">
                                    <h3 class="text-xl">{recording.title}</h3>
                                    {#if recording.description}
                                        <div class="max-w-none">{recording.description}</div>
                                    {/if}
                                </div>
                            </article>
                        {/if}
                    {/snippet}
                    {#snippet empty()}
                        <p class="text-muted">{i18n.t("gallery.recordingsEmpty")}</p>
                    {/snippet}
                </PaginatedList>
            </section>

            <section class="border-t border-divider pt-12 pb-4">
                {#if data.gallery.images.length}
                    <Gallery
                        gallery={data.gallery}
                        onImageClick={handleImageClick}
                        imageItemClass="rounded-xl"
                        density="comfortable"
                        children={galleryImageLegend}
                    />
                {:else}
                    <h2 class="text-section-title text-primary-dark">{i18n.t("gallery.photos")}</h2>
                    <p class="mt-6 rounded-xl border border-dashed border-control-border p-6 text-muted">
                        {i18n.t("gallery.photosEmpty")}
                    </p>
                {/if}
            </section>
        </div>

        <GalleryModal bind:this={galleryModal} />
    </PageStructure>
</div>

<style>
    .media-page :global(.title-group) {
        max-width: 72rem;
        margin-inline: auto;
    }
</style>
