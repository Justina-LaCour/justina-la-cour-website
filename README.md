# Justina La Cour

English, French, and Danish website for violinist Justina La Cour. The SvelteKit 3 and Svelte 5 app reads its public content from Artkyt and deploys with the Vercel adapter. Artkyt also receives contact form submissions and is where the artist manages content.

## Local setup

```sh
nvm use
npm ci
cp .env.example .env
npm run dev
```

Set the four existing Artkyt IDs for Justina’s profile, website, biography, and selected photo gallery. The website ID also routes contact submissions. The canonical origin is `https://www.justinalacour.com`, including for preview builds.

Set a reCAPTCHA key pair valid for the environment’s hostnames. Set `SITE_HOSTNAMES` to a comma-separated list of exact bare hostnames, including the preview host in Preview. Configure three distinct secrets for the Artkyt webhook, Vercel ISR bypass, and Vercel cron. Set `NODE_OPTIONS=--experimental-require-module` in the Vercel environment for the template’s sanitize-html dependency bridge. Keep secrets in the deployment environment and local `.env` file. Public contact and website manager details are optional.

## Public pages

`/` redirects to `/en`. The `/en`, `/fr`, and `/da` routes each have Home, Biography, News, Concerts, Media, and Contact. News articles have their own localized URLs. Media combines Artkyt recordings and the selected photo gallery. The homepage pulls a biography excerpt, the first three news items, and the next five concerts from Artkyt. It embeds a featured YouTube video alongside the biography excerpt. The old `/admin` URLs return 404.

Site identity and navigation live in `src/lib/config/config.ts`. Interface translations are in `src/lib/translations`, the purple theme in `src/lib/config/theme.css`, and the responsive image roles in `src/lib/assets/images`. The original static image URLs and favicon are available for existing links. Photo credits from Artkyt display with gallery and news images. Confirm credits for the bundled photos before cutover.

## Validate and deploy

```sh
npm run validate
```

This runs Svelte and test type checks, unit and command tests, and a build with fixture environment values. Build again with the real Preview or Production configuration for deployment.

1. Deploy the branch to Vercel Preview with Justina’s Artkyt IDs and preview credentials. Open the six main pages and a news article in each language. Check mobile and desktop photo crops, gallery controls, recordings, navigation, and sharing metadata.
2. Send a test message from Preview and confirm receipt in the configured Artkyt website. Check that a resource webhook refreshes the expected pages and shows the changed content.
3. Use the accepted preview for production cutover. Retain the previous Vercel deployment as the rollback target.

## Refresh cached pages

`make revalidate` sends an authenticated POST with `{"pages":"all"}` to the origin in `PUBLIC_SITE_URL`. Override the origin in the shell to target Preview. The command reports which paths refreshed and exits nonzero on failure.

Configure Artkyt resource webhooks to POST to `/api/revalidate` with `ARTKYT_WEBHOOK_SECRET` as the bearer token. Biography, news, and concert changes also refresh their homepage previews. Recording changes and updates to the configured gallery refresh Media. Profile links refresh all main pages in every language. A news webhook with article IDs also refreshes the corresponding article URLs. Article pages have timed regeneration for collection-wide updates. Vercel’s daily cron uses `CRON_SECRET` to refresh all main pages.
