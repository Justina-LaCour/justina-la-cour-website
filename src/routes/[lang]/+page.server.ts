import { PUBLIC_ARTKYT_BIO_ID } from "$app/env/public";
import { artkytClient } from "$lib/artkyt";
import { isPlayableRecording } from "$lib/artkyt/constants/externalPlatforms";
import {
    upcomingConcertsFilter,
    type APIConcertPreview,
    type APINewsItem,
    type APIRecording
} from "$lib/artkyt/types";
import { ARTKYT_ISR_CACHE } from "$lib/server/artkytCache";
import { optionalArtkyt } from "$lib/server/artkytResult";
import { ISR_CONFIG } from "$lib/server/isr";
import { textExcerpt } from "$lib/utils/text";
import type { PageServerLoad } from "./$types";

interface HomeData {
    bioExcerpt: string | null;
    latestNews: APINewsItem[];
    upcomingConcerts: APIConcertPreview[];
    featuredRecording: APIRecording | null;
}

export const config = ISR_CONFIG.concerts;

export const load = (async ({ fetch, params }): Promise<HomeData> => {
    const lang = params.lang;
    const options = { fetch, cache: ARTKYT_ISR_CACHE };
    const [bio, news, concerts, recordings] = await Promise.all([
        artkytClient.getBio({ id: PUBLIC_ARTKYT_BIO_ID, lang, format: "plain" }, options),
        artkytClient.getNewsList({ lang, pagination: { pageSize: 3 } }, options),
        artkytClient.getConcertsList({
            lang,
            filter: upcomingConcertsFilter(),
            pagination: { pageSize: 5 }
        }, options),
        artkytClient.getRecordingsList({ lang, pagination: { pageSize: 30 } }, options)
    ]);

    const bioText = optionalArtkyt(bio, null, "home biography")?.bio.content ?? "";
    return {
        bioExcerpt: textExcerpt(bioText, 360) || null,
        latestNews: optionalArtkyt(news, null, "home news")?.items.slice(0, 3) ?? [],
        upcomingConcerts: optionalArtkyt(concerts, null, "home concerts")?.items.slice(0, 5) ?? [],
        featuredRecording: optionalArtkyt(recordings, null, "home recordings")
            ?.items.slice(0, 30).find(isPlayableRecording) ?? null
    };
}) satisfies PageServerLoad;
