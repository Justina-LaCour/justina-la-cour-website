<script lang="ts">
    import { provideI18n, I18n } from "$lib/i18n/i18n.svelte";
    import { site } from "$lib/config/config";
    import TopNav from "$lib/components/navigation/TopNav.svelte";
    import ExternalPlatformsLinks from "$lib/artkyt/components/ExternalPlatformsLinks.svelte";
    import { ARTKYT_ORIGIN } from "$lib/artkyt/constants/urls";

    let { data, children } = $props();

    function createI18n() {
        return provideI18n(new I18n({
            locale: data.lang,
            initialMessages: {
                [data.lang]: data.messages
            },
            defaultVariables: {
                siteName: site.identity.name
            }
        }));
    }

    const i18n = createI18n();
    $effect.pre(() => {
        i18n.registerLocale(data.lang, data.messages);
        i18n.locale = data.lang;
    });

    $effect(() => {
        document.documentElement.lang = data.lang;
    });
</script>

<a class="skip-link" href="#main-content">{i18n.t("nav.skipToContent")}</a>
<TopNav />
{@render children?.()}
<footer class="bg-black backdrop-blur-2xl p-4 lg:py-6 lg:px-12">
    <div class="flex justify-between gap-8 flex-wrap">
        <div>
            <div class="mb-8">
                <ExternalPlatformsLinks links={data.profileLinks} />
            </div>
            {#if site.credits.website || site.credits.showArtkyt}
                <p class="text-background">
                    {#if site.credits.website}
                        {i18n.t("footer.by")} <a
                            class="transition-ui reduce-motion border-b border-transparent hover:border-background"
                            href={site.credits.website.url}
                            target="_blank"
                            rel="noopener noreferrer">{site.credits.website.label}</a
                        >
                    {/if}
                    {#if site.credits.website && site.credits.showArtkyt}<br />{/if}
                    {#if site.credits.showArtkyt}
                        {i18n.t("footer.poweredBy")}
                        <a
                            class="transition-ui reduce-motion border-b border-transparent hover:border-background"
                            href={ARTKYT_ORIGIN}
                            target="_blank"
                            rel="noopener noreferrer">Artkyt</a
                        >
                    {/if}
                </p>
            {/if}
        </div>
    </div>
</footer>
