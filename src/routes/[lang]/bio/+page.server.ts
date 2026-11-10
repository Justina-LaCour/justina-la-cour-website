import { artkytClient } from "$lib/artkyt";
import { ISR_CONFIG } from "$lib/server/isr";
import { sanitizeRichTextHtml } from "$lib/server/sanitizeRichTextHtml";
import { requireArtkyt } from "$lib/server/artkytResult";
import { ARTKYT_ISR_CACHE } from "$lib/server/artkytCache";
import { PUBLIC_ARTKYT_BIO_ID } from "$app/env/public";
import type { PageServerLoad } from "./$types";

export const config = ISR_CONFIG.slowMoving;

export const load: PageServerLoad = async ({ fetch, params }) => {
    const lang = params.lang;
    const bio = await artkytClient.getBio(
        {
            id: PUBLIC_ARTKYT_BIO_ID,
            lang,
            format: "html"
        },
        {
            fetch,
            cache: ARTKYT_ISR_CACHE
        }
    );

    return {
        bioHtml: sanitizeRichTextHtml(requireArtkyt(bio, "biography").bio.content)
    };
};
