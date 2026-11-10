import type { Result } from "$lib/artkyt/result";
import type {
    PaginatedListPage,
    Pagination
} from "$lib/artkyt/types";

export type LoadMore<T> = (
    pagination: Pagination
) => Promise<Result<PaginatedListPage<T>>>;
