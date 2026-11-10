import { requireArtkyt } from "$lib/server/artkytResult";
import { ARTKYT_ISR_CACHE } from "$lib/server/artkytCache";
import { ISR_CONFIG } from "$lib/server/isr";
import type { PageServerLoad } from "./$types";
import { getNewsPage } from "./newsList";

export const config = ISR_CONFIG.slowMoving;

export const load: PageServerLoad = async ({ fetch, params }) => {
    const news = await getNewsPage(
        params.lang,
        { page: 0, pageSize: 10 },
        {
            fetch,
            cache: ARTKYT_ISR_CACHE
        }
    );

    return { news: requireArtkyt(news, "news") };
};
