import { spawnSync } from "node:child_process";

// Validation never needs a live Artkyt account or the deployment's credentials.
const env = {
    ...process.env,
    PUBLIC_SITE_URL: "https://justina.example",
    PUBLIC_ARTKYT_PROFILE_ID: "test-profile",
    PUBLIC_ARTKYT_WEBSITE_ID: "test-website",
    PUBLIC_ARTKYT_BIO_ID: "test-bio",
    PUBLIC_ARTKYT_GALLERY_ID: "test-gallery",
    PUBLIC_CONTACT_EMAIL: "",
    PUBLIC_CONTACT_LOCATION: "",
    PUBLIC_WEBSITE_MANAGER_NAME: "",
    PUBLIC_WEBSITE_MANAGER_EMAIL: "",
    PUBLIC_WEBSITE_MANAGER_ADDRESS: "",
    PUBLIC_RECAPTCHA_SITEKEY: "test-site-key",
    RECAPTCHA_SECRET_KEY: "test-captcha-secret",
    SITE_HOSTNAMES: "justina.example,localhost",
    ARTKYT_WEBHOOK_SECRET: "test-webhook-secret",
    ISR_BYPASS_TOKEN: "test-isr-secret",
    CRON_SECRET: "test-cron-secret"
};

for (const script of ["check", "test:typecheck", "test", "test:commands", "build"]) {
    const result = spawnSync("npm", ["run", script], { env, stdio: "inherit" });
    if (result.error || result.status !== 0) {
        if (result.error) console.error(result.error.message);
        process.exit(result.status ?? 1);
    }
}
