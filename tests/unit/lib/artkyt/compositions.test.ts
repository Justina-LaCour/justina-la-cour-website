import { describe, expect, it } from "vitest";
import type { APIComposition } from "$lib/artkyt/types";
import {
    compositionCategories,
    compositionMatchesCategory
} from "$lib/artkyt/compositions";

function composition(id: string, category: string): APIComposition {
    return {
        id,
        category,
        selectedLanguage: "en",
        title: id,
        description: "",
        compositionYear: 2025,
        duration: "",
        instrumentation: "",
        publisher: "",
        buySheetUrl: "",
        hasBeenPremiered: false,
        recordings: []
    };
}

describe("composition filters", () => {
    const items = [
        composition("one", "solo"),
        composition("two", " ensemble "),
        composition("three", "solo"),
        composition("four", "")
    ];

    it("derives unique normalized categories from all loaded items", () => {
        expect(compositionCategories(items)).toEqual(["solo", "ensemble"]);
    });

    it("matches a selected category or all items", () => {
        expect(items.filter((item) => compositionMatchesCategory(item, "solo")))
            .toHaveLength(2);
        expect(items.every((item) => compositionMatchesCategory(item, null)))
            .toBe(true);
    });
});
