<script lang="ts">
    import { resolve } from "$app/paths";
    import { page } from "$app/state";
    import { site, type SupportedLanguage } from "$lib/config/config";
    import { normalizeOpenGraphLocale } from "./openGraph";

    interface Props {
        title: string;
        description?: string;
        imageUrl?: string;
        imageWidth?: number;
        imageHeight?: number;
        imageType?: string;
    }

    let {
        title,
        description,
        imageUrl,
        imageWidth = 1200,
        imageHeight = 630,
        imageType = "image/jpeg"
    }: Props = $props();

    const resolvedDescription = $derived(description?.trim() || undefined);
    const absoluteImageUrl = $derived(
        // @ts-expect-error URL accepts a readonly URL as its base without mutating it.
        imageUrl?.trim() ? new URL(imageUrl.trim(), page.url).href : undefined
    );
    const currentLanguage = $derived(
        page.params.lang as SupportedLanguage
    );
    function localizedUrl(language: SupportedLanguage): string {
        // @ts-expect-error SvelteKit cannot correlate a runtime route with its params.
        const pathname = resolve(page.route.id!, {
            ...page.params,
            lang: language
        });
        return new URL(pathname, site.identity.canonicalUrl).href;
    }

    const canonicalUrl = $derived(
        localizedUrl(currentLanguage)
    );
</script>

<svelte:head>
    <title>{title}</title>
    <meta property="og:title" content={title} />
    <meta property="og:site_name" content={site.identity.name} />
    <meta property="og:type" content="website" />
    <meta
        property="og:locale"
        content={normalizeOpenGraphLocale(currentLanguage)}
    />
    {#each site.locales.supported as language}
        {#if language !== currentLanguage}
            <meta
                property="og:locale:alternate"
                content={normalizeOpenGraphLocale(language)}
            />
        {/if}
    {/each}
    <link rel="canonical" href={canonicalUrl} />
    {#each site.locales.supported as language}
        <link rel="alternate" hreflang={language} href={localizedUrl(language)} />
    {/each}
    <link
        rel="alternate"
        hreflang="x-default"
        href={localizedUrl(site.locales.default)}
    />
    <meta property="og:url" content={canonicalUrl} />
    <meta
        name="twitter:card"
        content={absoluteImageUrl ? "summary_large_image" : "summary"}
    />
    <meta name="twitter:title" content={title} />
    {#if resolvedDescription}
        <meta name="description" content={resolvedDescription} />
        <meta property="og:description" content={resolvedDescription} />
        <meta name="twitter:description" content={resolvedDescription} />
    {/if}
    {#if absoluteImageUrl}
        <meta property="og:image" content={absoluteImageUrl} />
        <meta property="og:image:secure_url" content={absoluteImageUrl} />
        <meta property="og:image:type" content={imageType} />
        <meta property="og:image:width" content={String(imageWidth)} />
        <meta property="og:image:height" content={String(imageHeight)} />
        <meta name="twitter:image" content={absoluteImageUrl} />
    {/if}
</svelte:head>
