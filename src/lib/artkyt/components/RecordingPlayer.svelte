<script lang="ts">
    import {
        getEmbedPlayerUrl,
        type RecordingPlatformCode,
    } from "../constants/externalPlatforms";
    import { useI18n } from "$lib/i18n/i18n.svelte";

    interface Props {
        platform: RecordingPlatformCode;
        url: string;
        iframeClass?: string;
    }

    let { platform, url, iframeClass }: Props = $props();
    const i18n = useI18n();

    let embedPlayerUrl = $derived(getEmbedPlayerUrl(platform, url));
    let height = $derived.by(() => {
        if (["spotify", "soundcloud"].includes(platform?.toLowerCase()))
            return "152";
        return "315";
    });
</script>

{#if embedPlayerUrl}
    <div class="w-full max-w-[560px]">
        {#if platform === "bandcamp"}
            <a
                href={embedPlayerUrl.href}
                target="_blank"
                rel="noopener noreferrer"
                class="flex gap-2 w-min"
            >
                {i18n.t("recordings.openBandcamp")}
            </a>
        {:else}
            <iframe
                class={iframeClass}
                src={embedPlayerUrl.href}
                title={i18n.t("recordings.previewTitle")}
                width="100%"
                {height}
                loading="lazy"
                referrerpolicy="strict-origin-when-cross-origin"
                frameborder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            ></iframe>
        {/if}
    </div>
{/if}
