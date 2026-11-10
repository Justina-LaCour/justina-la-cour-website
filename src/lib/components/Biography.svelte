<script lang="ts">
    import RichText from "$lib/components/content/RichText.svelte";
    import DownloadIcon from "$lib/components/icons/DownloadIcon.svelte";
    import { useI18n } from "$lib/i18n/i18n.svelte";

    interface Props {
        contentHtml: string;
        downloadable?: boolean;
    }

    let { contentHtml, downloadable = true }: Props = $props();
    const i18n = useI18n();
    let downloadHref = $derived(
        `data:text/html;charset=utf-8,${encodeURIComponent(contentHtml)}`
    );
</script>

<RichText sanitizedHtml={contentHtml} />
{#if downloadable}
    <div class="mt-8">
        <a
            href={downloadHref}
            download="Bio_{i18n.locale.toUpperCase()}.html"
            class="transition-ui reduce-motion inline-flex items-center gap-2 rounded-full bg-primary-dark px-6 py-3 text-white no-underline hover:bg-primary"
        >
            <DownloadIcon class="size-5" />
            <span>{i18n.t("bio.download")}</span>
        </a>
    </div>
{/if}
