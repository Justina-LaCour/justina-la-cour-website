import type { APIComposition } from "./types";

export function normalizeCompositionCategory(category: string): string {
    return category.trim();
}

export function compositionCategories(
    compositions: readonly APIComposition[]
): string[] {
    return [...new Set(
        compositions
            .map(({ category }) => normalizeCompositionCategory(category))
            .filter(Boolean)
    )];
}

export function compositionMatchesCategory(
    composition: APIComposition,
    category: string | null
): boolean {
    return category === null ||
        normalizeCompositionCategory(composition.category) === category;
}
