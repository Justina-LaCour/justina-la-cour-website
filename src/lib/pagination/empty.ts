import type { PaginatedListPage } from "$lib/artkyt/types";

export function emptyPaginatedList<T>(pageSize = 30): PaginatedListPage<T> {
    return {
        items: [],
        pagination: {
            page: 0,
            pageSize,
            total: 0
        }
    };
}
