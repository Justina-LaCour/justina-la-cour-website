import {
    PUBLIC_SITE_URL,
    PUBLIC_CONTACT_EMAIL,
    PUBLIC_CONTACT_LOCATION,
    PUBLIC_WEBSITE_MANAGER_NAME,
    PUBLIC_WEBSITE_MANAGER_EMAIL,
    PUBLIC_WEBSITE_MANAGER_ADDRESS
} from "$app/env/public";
import { normalizeCanonicalUrl } from "$lib/utils/urls";
import type {
    NavigationWordmark,
    SiteContact,
    SiteDefinition
} from "$lib/site/definition";

const supportedLanguages = ["en", "fr", "da"] as const;
const artistName = "Justina La Cour";
const contactEmail = PUBLIC_CONTACT_EMAIL.trim();
const navigationWordmark = undefined as NavigationWordmark | undefined;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const site = {
    identity: {
        name: artistName,
        titleSuffix: ` - ${artistName}`,
        canonicalUrl: normalizeCanonicalUrl(PUBLIC_SITE_URL),
        navigationWordmark
    },
    locales: {
        supported: supportedLanguages,
        default: "en",
        openGraph: { en: "en_GB", fr: "fr_FR", da: "da_DK" }
    },
    navigation: [
        { route: "/[lang]", nameKey: "nav.home" },
        { route: "/[lang]/bio", nameKey: "nav.bio" },
        { route: "/[lang]/news", nameKey: "nav.news" },
        { route: "/[lang]/concerts", nameKey: "nav.concerts" },
        { route: "/[lang]/media", nameKey: "nav.gallery" },
        { route: "/[lang]/contact", nameKey: "nav.contact" }
    ],
    contact: {
        email: contactEmail,
        location: PUBLIC_CONTACT_LOCATION.trim() || undefined
    },
    legal: {
        websiteManager: {
            name: PUBLIC_WEBSITE_MANAGER_NAME.trim() || undefined,
            email: PUBLIC_WEBSITE_MANAGER_EMAIL.trim() || undefined,
            addressLines: PUBLIC_WEBSITE_MANAGER_ADDRESS
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean)
        },
        hostingProvider: undefined as SiteContact | undefined,
        domainRegistrar: undefined as SiteContact | undefined
    },
    credits: {
        website: {
            label: "Cyprien Lengagne",
            url: "https://www.cyprienlengagne.com"
        },
        showArtkyt: true
    }
} as const satisfies SiteDefinition<SupportedLanguage>;
