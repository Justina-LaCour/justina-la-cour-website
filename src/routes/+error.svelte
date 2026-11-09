<script lang="ts">
    import { page } from "$app/state";
    import ErrorPage from "$lib/components/ErrorPage.svelte";
    import { resolvePublicErrorTranslationKey } from "$lib/errors";
    import { I18n } from "$lib/i18n/i18n.svelte";
    import { site } from "$lib/config/config";
    import englishMessages from "$lib/translations/en";

    const i18n = new I18n({
        locale: "en",
        initialMessages: {
            en: englishMessages
        }
    });
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
    homeHref={`/${site.locales.default}`}
/>
