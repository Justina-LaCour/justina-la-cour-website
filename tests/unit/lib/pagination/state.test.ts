import {
    failure,
    ok,
    type BaseError,
    type Result
} from "$lib/artkyt/result";
import type { PaginatedListPage } from "$lib/artkyt/types";
import { describe, expect, it, vi } from "vitest";
import { PaginatedListState } from "$lib/pagination/state.svelte";

function page(
    items: number[],
    currentPage = 0,
    total = 4,
    pageSize = 2
) {
    return {
        items,
        pagination: {
            page: currentPage,
            pageSize,
            total
        }
    };
}

describe("PaginatedListState", () => {
    it("initializes and resets from server-loaded pages", () => {
        const state = new PaginatedListState(page([1, 2]));

        expect(state.items).toEqual([1, 2]);
        expect(state.hasMore).toBe(true);
        expect(state.error).toBeUndefined();

        state.reset(page([3], 0, 1));

        expect(state.items).toEqual([3]);
        expect(state.hasMore).toBe(false);
        expect(state.error).toBeUndefined();
    });

    it("loads and appends the next page", async () => {
        const state = new PaginatedListState(page([1, 2]));
        const loadMore = vi.fn(async () => ok(page([3, 4], 1)));

        await state.loadNext(loadMore);

        expect(loadMore).toHaveBeenCalledWith({ page: 1, pageSize: 2 });
        expect(state.items).toEqual([1, 2, 3, 4]);
        expect(state.pagination?.page).toBe(1);
        expect(state.hasMore).toBe(false);
        expect(state.loading).toBe(false);
    });

    it("retains loaded items when the next page fails", async () => {
        const state = new PaginatedListState(page([1, 2]));
        const error: BaseError = {
            code: "unavailable",
            message: "Unable to load more items"
        };

        await state.loadNext(async () => failure(error));

        expect(state.items).toEqual([1, 2]);
        expect(state.error).toEqual(error);
        expect(state.loading).toBe(false);
    });

    it("normalizes a thrown loader error", async () => {
        const state = new PaginatedListState(page([1, 2]));

        await state.loadNext(async () => {
            throw new Error("connection closed");
        });

        expect(state.error).toEqual({
            code: "error",
            message: "An error occurred while loading the next page"
        });
        expect(state.loading).toBe(false);
    });

    it("ignores a stale page after reset", async () => {
        const state = new PaginatedListState(page([1, 2]));
        let resolveRequest!: (
            result: Result<PaginatedListPage<number>>
        ) => void;
        const request = new Promise<Result<PaginatedListPage<number>>>(
            (resolve) => {
                resolveRequest = resolve;
            }
        );

        const loading = state.loadNext(() => request);
        state.reset(page([10], 0, 1));
        resolveRequest(ok(page([3, 4], 1)));
        await loading;

        expect(state.items).toEqual([10]);
        expect(state.pagination?.page).toBe(0);
        expect(state.loading).toBe(false);
    });
});
