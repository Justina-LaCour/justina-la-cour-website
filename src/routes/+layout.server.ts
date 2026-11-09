import { artkytClient } from "$lib/artkyt";
import type { ArtkytProfileLink } from "$lib/artkyt/types";
import { emptyPaginatedList } from "$lib/pagination";
import { optionalArtkyt } from "$lib/server/artkytResult";
import { ARTKYT_ISR_CACHE } from "$lib/server/artkytCache";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch }) => {
    const profileLinks = await artkytClient.getProfileLinks(
        {
            pagination: { pageSize: 50 }
        },
        {
            fetch,
            cache: ARTKYT_ISR_CACHE
        }
    );

    return {
        profileLinks: optionalArtkyt(
            profileLinks,
            emptyPaginatedList<ArtkytProfileLink>(50),
            "layout profile links"
        ).items
    };
};
