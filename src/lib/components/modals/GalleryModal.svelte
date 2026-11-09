<script lang="ts">
    import type { ArtkytImage } from "$lib/artkyt/types";
    import DownloadIcon from "$lib/components/icons/DownloadIcon.svelte";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import { site } from "$lib/config/config";
    import { safeExternalHttpUrl } from "$lib/utils/urls";
    import LazyImage from "../images/LazyImage.svelte";
    import LoadingSpinner from "../utils/LoadingSpinner.svelte";
    import Modal from "./Modal.svelte";

    let modal: Modal;
    const i18n = useI18n();

    type ImageStatus = "loading" | "loaded" | "error";
    type DownloadStatus = "idle" | "downloading" | "error";

    let picture: ArtkytImage = $state({
        credits: "",
        originalQualityUrl: ""
    });

    let imageUrl = $state("");
    let imageStatus = $state<ImageStatus>("loading");
    let downloadStatus = $state<DownloadStatus>("idle");

    export function show(galleryPicture: ArtkytImage): void {
        const nextImageUrl =
            galleryPicture.highQualityUrl ||
            galleryPicture.originalQualityUrl;
        const shouldLoad = imageUrl !== nextImageUrl || imageStatus === "error";

        picture = galleryPicture;
        imageUrl = nextImageUrl;
        if (shouldLoad) imageStatus = "loading";
        downloadStatus = "idle";
        modal.show();
    }

    function handleImageLoaded(): void {
        if (imageStatus === "loading") {
            imageStatus = "loaded";
        }
    }

    function handleImageError(): void {
        if (
            imageUrl === picture.highQualityUrl &&
            picture.originalQualityUrl &&
            picture.originalQualityUrl !== imageUrl
        ) {
            imageUrl = picture.originalQualityUrl;
            return;
        }

        imageStatus = "error";
        if (picture.thumbnailUrl && picture.thumbnailUrl !== imageUrl) {
            imageUrl = picture.thumbnailUrl;
        }
    }

    async function downloadPicture() {
        downloadStatus = "downloading";

        try {
            const downloadUrl = safeExternalHttpUrl(
                picture.originalQualityUrl
            );
            if (!downloadUrl) throw new Error("Invalid download URL");

            const response = await fetch(downloadUrl);
            if (!response.ok) throw new Error("Download failed");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.style.display = "none";
            a.download = site.identity.name.trim().replace(/\s+/g, "_");

            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            downloadStatus = "idle";
        } catch {
            downloadStatus = "error";
        }
    }

</script>

<Modal bind:this={modal} label={i18n.t("gallery.imagePreview")}>
     {#snippet leftButton()}
        <button
            class="transition-ui reduce-motion rounded p-2 text-white hover:bg-primary/50"
            aria-label={i18n.t("gallery.download")}
            aria-busy={downloadStatus === "downloading"}
            disabled={downloadStatus === "downloading"}
            onclick={downloadPicture}
        >
            <DownloadIcon class="block size-6" />
        </button>
     {/snippet}

     {#snippet title()}
        &#169; { picture.credits }
     {/snippet}

     <div class="relative">
        {#if imageStatus === "error"}
            <p class="py-2 text-red-800 text-center text-2xl" role="alert">
                {i18n.t("gallery.imageUnavailable")}
            </p>
        {/if}

        {#if downloadStatus === "error"}
            <p class="py-2 text-red-800 text-center text-2xl" role="alert">
                {i18n.t("gallery.downloadFailed")}
            </p>
        {/if}

        {#key imageUrl}
            <LazyImage
                class="main-image"
                lowresSrc={picture.thumbnailUrl}
                src={imageUrl}
                alt=""
                loading="eager"
                onFullResLoaded={handleImageLoaded}
                onFullResError={handleImageError}
            />
        {/key}
    </div>

    {#if imageStatus === "loading"}
        <div class="absolute inset-0 flex items-center justify-center min-w-max">
            <LoadingSpinner message={i18n.t("gallery.loadingFullResolution")} class="text-white" />
        </div>
    {/if}
</Modal>

<style>

    :global(.main-image) {
        max-width: calc(100dvw - 2rem);
        max-height: calc(100dvh - 8rem);
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
    }

</style>
