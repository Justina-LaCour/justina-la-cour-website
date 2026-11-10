import { emptyPaginatedList } from "$lib/pagination";
import { describe, expect, expectTypeOf, it } from "vitest";

describe("emptyPaginatedList", () => {
    it("creates an empty first page with the default page size", () => {
        const page = emptyPaginatedList<string>();

        expect(page).toEqual({
            items: [],
            pagination: {
                page: 0,
                pageSize: 30,
                total: 0
            }
        });
        expectTypeOf(page.items).toEqualTypeOf<string[]>();
    });

    it("accepts a custom page size", () => {
        expect(emptyPaginatedList<number>(50).pagination.pageSize).toBe(50);
    });

    it("returns independent result, items and metadata objects", () => {
        const first = emptyPaginatedList<string>();
        const second = emptyPaginatedList<string>();

        expect(first).not.toBe(second);
        expect(first.items).not.toBe(second.items);
        expect(first.pagination).not.toBe(second.pagination);
    });
});
