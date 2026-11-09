<script lang="ts">
    import { page } from "$app/state";
    import ErrorPage from "$lib/components/ErrorPage.svelte";
    import { resolvePublicErrorTranslationKey } from "$lib/errors";
    import { useI18n } from "$lib/i18n/i18n.svelte";

    const i18n = useI18n();
    const translationKey = $derived(
        resolvePublicErrorTranslationKey(
            page.status,
            page.error?.translationKey
        )
    );
</script>

<ErrorPage
    status={page.status}
    pageTitle={i18n.t("errorPage.pageTitle")}
    title={i18n.t(`${translationKey}.title`)}
    description={i18n.t(`${translationKey}.description`)}
    homeLabel={i18n.t("errorPage.home")}
    retryLabel={i18n.t("errorPage.retry")}
    homeHref={`/${i18n.locale}`}
/>
