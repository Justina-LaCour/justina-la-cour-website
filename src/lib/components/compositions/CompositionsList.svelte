<script lang="ts">
    import {
        compositionCategories,
        compositionMatchesCategory
    } from "$lib/artkyt/compositions";
    import type {
        APIComposition,
        PaginatedListPage
    } from "$lib/artkyt/types";
    import type { LoadMore } from "$lib/pagination";
    import PaginatedList from "$lib/components/PaginatedList.svelte";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import type { Snippet } from "svelte";
    import CompositionCategoryFilters from "./CompositionCategoryFilters.svelte";
    import CompositionItem from "$lib/components/compositionItem/CompositionItem.svelte";

    interface Props {
        initialData: PaginatedListPage<APIComposition>;
        loadMore: LoadMore<APIComposition>;
        item?: Snippet<[APIComposition]>;
    }

    let { initialData, loadMore, item }: Props = $props();
    const i18n = useI18n();
    let selectedCategory = $state<string | null>(null);

    function matchesSelectedCategory(composition: APIComposition): boolean {
        return compositionMatchesCategory(composition, selectedCategory);
    }
</script>

<PaginatedList
    {initialData}
    {loadMore}
    filter={matchesSelectedCategory}
    class="grid gap-12"
>
    {#snippet controls(loadedItems)}
        <CompositionCategoryFilters
            categories={compositionCategories(loadedItems)}
            bind:selected={selectedCategory}
        />
    {/snippet}

    {#snippet children(composition)}
        {#if item}
            {@render item(composition)}
        {:else}
            <CompositionItem {composition} />
        {/if}
    {/snippet}

    {#snippet empty()}
        <p class="m-0 text-muted">
            {i18n.t(
                selectedCategory === null
                    ? "compositions.empty"
                    : "compositions.emptyCategory"
            )}
        </p>
    {/snippet}
</PaginatedList>
