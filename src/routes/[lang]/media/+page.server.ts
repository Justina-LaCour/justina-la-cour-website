import { PUBLIC_ARTKYT_GALLERY_ID } from "$app/env/public";
import { artkytClient } from "$lib/artkyt";
import type { APIGallery, APIRecording, PaginatedListPage } from "$lib/artkyt/types";
import { ARTKYT_ISR_CACHE } from "$lib/server/artkytCache";
import { requireArtkyt } from "$lib/server/artkytResult";
import { ISR_CONFIG } from "$lib/server/isr";
import type { PageServerLoad } from "./$types";

interface MediaData {
    gallery: APIGallery;
    recordings: PaginatedListPage<APIRecording>;
}

export const config = ISR_CONFIG.slowMoving;

export const load = (async ({ fetch, params }): Promise<MediaData> => {
    const lang = params.lang;
    const options = { fetch, cache: ARTKYT_ISR_CACHE };
    const [gallery, recordings] = await Promise.all([
        artkytClient.getGallery({ id: PUBLIC_ARTKYT_GALLERY_ID, lang, format: "plain" }, options),
        artkytClient.getRecordingsList({ lang, pagination: { pageSize: 30 } }, options)
    ]);

    return {
        gallery: requireArtkyt(gallery, "media gallery").gallery,
        recordings: requireArtkyt(recordings, "media recordings")
    };
}) satisfies PageServerLoad;
