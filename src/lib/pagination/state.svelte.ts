import type { BaseError } from "$lib/artkyt/result";
import type {
    PaginatedListPage,
    Pagination,
    PaginationMetadata
} from "$lib/artkyt/types";
import type { LoadMore } from "./types";

export class PaginatedListState<T> {
    items = $state<T[]>([]);
    pagination = $state<PaginationMetadata>();
    loading = $state(false);
    error = $state<BaseError>();

    #requestVersion = 0;

    public constructor(initialData: PaginatedListPage<T>) {
        this.reset(initialData);
    }

    get hasMore(): boolean {
        if (!this.pagination) return false;

        const totalPages = Math.ceil(
            this.pagination.total / this.pagination.pageSize
        );

        return this.pagination.page + 1 < totalPages;
    }

    get canLoadMore(): boolean {
        return this.hasMore && !this.loading;
    }

    public reset(initialData: PaginatedListPage<T>): void {
        this.#requestVersion += 1;
        this.loading = false;

        this.items = [...initialData.items];
        this.pagination = { ...initialData.pagination };
        this.error = undefined;
    }

    public async loadNext(loadMore: LoadMore<T>): Promise<void> {
        if (!this.canLoadMore || !this.pagination) return;

        const requestVersion = this.#requestVersion;
        const nextPagination: Pagination = {
            page: this.pagination.page + 1,
            pageSize: this.pagination.pageSize
        };

        this.loading = true;
        this.error = undefined;

        try {
            const result = await loadMore(nextPagination);

            if (requestVersion !== this.#requestVersion) return;

            if (!result.success) {
                this.error = result.error;

                return;
            }

            this.items = [...this.items, ...result.value.items];
            this.pagination = { ...result.value.pagination };
        } catch {
            if (requestVersion !== this.#requestVersion) return;

            this.error = {
                code: "error",
                message: "An error occurred while loading the next page"
            };
        } finally {
            if (requestVersion === this.#requestVersion) {
                this.loading = false;
            }
        }
    }
}
