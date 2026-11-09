import { artkytClient } from "$lib/artkyt";
import { pastConcertsFilter, upcomingConcertsFilter } from "$lib/artkyt/types";
import { ISR_CONFIG } from "$lib/server/isr";
import { requireArtkyt } from "$lib/server/artkytResult";
import { ARTKYT_ISR_CACHE } from "$lib/server/artkytCache";
import type { PageServerLoad } from "./$types";

export const config = ISR_CONFIG.concerts;

export const load: PageServerLoad = async ({ fetch, params }) => {
    const lang = params.lang;
    const [upcoming, past] = await Promise.all([
        artkytClient.getConcertsList(
            {
                lang,
                filter: upcomingConcertsFilter(),
                pagination: { pageSize: 30 }
            },
            {
                fetch,
                cache: ARTKYT_ISR_CACHE
            }
        ),
        artkytClient.getConcertsList(
            {
                lang,
                filter: pastConcertsFilter(),
                pagination: { pageSize: 10 }
            },
            {
                fetch,
                cache: ARTKYT_ISR_CACHE
            }
        )
    ]);

    return {
        upcoming: requireArtkyt(upcoming, "upcoming concerts"),
        past: requireArtkyt(past, "past concerts")
    };
};
