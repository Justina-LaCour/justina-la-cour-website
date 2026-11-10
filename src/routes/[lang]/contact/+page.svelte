<script lang="ts">
    import { contactBanner } from "$lib/assets/images/contact";
    import LegalDetails from "$lib/components/content/LegalDetails.svelte";
    import ContactForm from "$lib/components/forms/ContactForm.svelte";
    import PageStructure from "$lib/components/navigation/pageStructure/PageStructure.svelte";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import { site } from "$lib/config/config";

    import ExternalPlatformsLinks from "$lib/artkyt/components/ExternalPlatformsLinks.svelte";

    let { data } = $props();
    const i18n = useI18n();
</script>

<PageStructure
    title={i18n.t("contact.title")}
    ogDescription={i18n.t("og.contactDescription")}
    config={{
        bannerImage: contactBanner,
        openGraphImage: contactBanner.openGraphSrc,
        bannerMobilePosition: "50% 35%"
    }}
>
    <div class="contact-page">
        <section class="primary-contact">
            <h2 class="mb-4 text-section-title text-primary-dark">
                {site.identity.name}
            </h2>
            <p class="primary-contact-details">
                {site.identity.name}
                {#if site.contact.email}
                    <br /><a class="border-b border-current" href="mailto:{site.contact.email}">{site.contact.email}</a>
                {/if}
                {#if site.contact.location}<br />{site.contact.location}{/if}
            </p>
        </section>

        <section class="max-w-2xl">
            <h2 class="mb-6 text-section-title text-primary-dark">
                {i18n.t("forms.contact.title")}
            </h2>
            <ContactForm />
        </section>

        {#if data.profileLinks.length > 0}
            <section>
                <h2 class="mb-6 text-section-title">{i18n.t("contact.socialLinks")}</h2>
                <ExternalPlatformsLinks links={data.profileLinks} />
            </section>
        {/if}

        <LegalDetails>
            {#if site.legal.websiteManager.name || site.legal.websiteManager.email || site.legal.websiteManager.addressLines.length}
                <section>
                    <h2>{i18n.t("contact.responsibleTitle")}</h2>
                    <p>
                        {#if site.legal.websiteManager.name}{site.legal.websiteManager.name}<br />{/if}
                        {#if site.legal.websiteManager.email}
                            <a class="border-b border-current" href="mailto:{site.legal.websiteManager.email}">{site.legal.websiteManager.email}</a>
                        {/if}
                        {#each site.legal.websiteManager.addressLines ?? [] as line}
                            <br />{line}
                        {/each}
                    </p>
                </section>
            {/if}

            {#if site.legal.hostingProvider}
                <section>
                    <h2>{i18n.t("contact.hostTitle")}</h2>
                    <p>
                        {site.legal.hostingProvider.name}
                        {#each site.legal.hostingProvider.addressLines ?? [] as line}
                            <br />{line}
                        {/each}
                        {#if site.legal.hostingProvider.website}
                            <br /><a class="border-b border-current" href={site.legal.hostingProvider.website.url} target="_blank" rel="noopener noreferrer">{site.legal.hostingProvider.website.label}</a>
                        {/if}
                    </p>
                </section>
            {/if}

            {#if site.legal.domainRegistrar}
                <section>
                    <h2>{i18n.t("contact.domainRegistrarTitle")}</h2>
                    <p>
                        {site.legal.domainRegistrar.name}
                        {#each site.legal.domainRegistrar.addressLines ?? [] as line}
                            <br />{line}
                        {/each}
                        {#if site.legal.domainRegistrar.website}
                            <br /><a class="border-b border-current" href={site.legal.domainRegistrar.website.url} target="_blank" rel="noopener noreferrer">{site.legal.domainRegistrar.website.label}</a>
                        {/if}
                    </p>
                </section>
            {/if}

            <section>
                <h2>{i18n.t("contact.copyrightTitle")}</h2>
                <p>{i18n.t("contact.copyrightText")}</p>
            </section>

            <section>
                <h2>{i18n.t("contact.liabilityTitle")}</h2>
                <p>{i18n.t("contact.liabilityText")}</p>
            </section>

            <section>
                <h2>{i18n.t("contact.technicalDataTitle")}</h2>
                <p>{i18n.t("contact.technicalDataText")}</p>
            </section>

            <section>
                <h2>{i18n.t("contact.embeddedContentTitle")}</h2>
                <p>{i18n.t("contact.embeddedContentText")}</p>
            </section>
        </LegalDetails>
    </div>
</PageStructure>

<style>
    .contact-page {
        display: flex;
        flex-direction: column;
        gap: 4rem;
    }

    .primary-contact {
        padding-bottom: 1rem;
    }

    .primary-contact-details {
        margin: 0;
        font-size: 1.35rem;
        line-height: 1.65;
    }

</style>
