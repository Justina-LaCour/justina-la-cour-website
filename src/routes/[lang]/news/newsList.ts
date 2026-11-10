import { artkytClient, type ArtkytRequestOptions } from "$lib/artkyt";
import type { Pagination } from "$lib/artkyt/types";

export function getNewsPage(lang: string, pagination: Pagination, options?: ArtkytRequestOptions) {
    return artkytClient.getNewsList({ lang, pagination, maxContentLength: 200 }, options);
}
