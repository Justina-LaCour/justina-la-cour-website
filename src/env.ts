import { defineEnvVars } from "@sveltejs/kit/env";
import * as v from "valibot";

const publicAtBuild = { public: true, static: true } as const;
const publicContentId = { ...publicAtBuild, schema: v.pipe(v.string(), v.trim(), v.nonEmpty()) };
const optionalText = (value: string | undefined) => value ?? "";

export const variables = defineEnvVars({
    PUBLIC_SITE_URL: publicAtBuild,
    PUBLIC_ARTKYT_PROFILE_ID: publicContentId,
    PUBLIC_ARTKYT_WEBSITE_ID: publicContentId,
    PUBLIC_ARTKYT_BIO_ID: publicContentId,
    PUBLIC_RECAPTCHA_SITEKEY: publicAtBuild,
    PUBLIC_CONTACT_EMAIL: { ...publicAtBuild, schema: optionalText },
    PUBLIC_CONTACT_LOCATION: { ...publicAtBuild, schema: optionalText },
    PUBLIC_WEBSITE_MANAGER_NAME: { ...publicAtBuild, schema: optionalText },
    PUBLIC_WEBSITE_MANAGER_EMAIL: { ...publicAtBuild, schema: optionalText },
    PUBLIC_WEBSITE_MANAGER_ADDRESS: { ...publicAtBuild, schema: optionalText },
    PUBLIC_ARTKYT_GALLERY_ID: publicContentId,
    RECAPTCHA_SECRET_KEY: { static: true },
    SITE_HOSTNAMES: { static: true },
    ARTKYT_WEBHOOK_SECRET: { static: true },
    ISR_BYPASS_TOKEN: { static: true },
    CRON_SECRET: { static: true }
});
