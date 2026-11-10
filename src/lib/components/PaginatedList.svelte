<script lang="ts" generics="T">
    import { untrack, type Snippet } from "svelte";
    import type { PaginatedListPage } from "$lib/artkyt/types";
    import {
        PaginatedListState,
        type LoadMore,
    } from "$lib/pagination";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import type { GroupItem } from "$lib/utils/array";

    interface BaseProps {
        initialData: PaginatedListPage<T>;
        loadMore: LoadMore<T>;
        children: Snippet<[T]>;
        empty?: Snippet;
        controls?: Snippet<[readonly T[]]>;
        class?: string;
        filter?: (item: T) => boolean;
        sort?: (a: T, b: T) => number;
    }

    type GroupingProps =
        | {
            group?: undefined;
            groupHeader?: undefined;
        }
        | {
            group: (items: T[]) => GroupItem<T>[];
            groupHeader: Snippet<[string]>;
        };

    type Props = BaseProps & GroupingProps;

    let {
        initialData,
        loadMore,
        children,
        empty,
        controls,
        class: className = "",
        filter,
        sort,
        group,
        groupHeader
    }: Props = $props();

    const i18n = useI18n();
    const state = new PaginatedListState(untrack(() => initialData));

    $effect(() => {
        state.reset(initialData);
    });

    const filteredItems = $derived(
        filter ? state.items.filter(filter) : [...state.items]
    );
    const sortedItems = $derived(
        sort ? [...filteredItems].sort(sort) : filteredItems
    );
    const groupedItems = $derived(group ? group([...sortedItems]) : undefined);
    const hasVisibleItems = $derived(
        groupedItems
            ? groupedItems.some(({ items }) => items.length > 0)
            : sortedItems.length > 0
    );
</script>

{@render controls?.([...state.items])}

{#if hasVisibleItems}
    {#if groupedItems && groupHeader}
        <div class="space-y-10">
            {#each groupedItems as itemGroup (itemGroup.groupKey)}
                {#if itemGroup.items.length > 0}
                    <section>
                        {@render groupHeader(itemGroup.groupKey)}
                        <div class={className}>
                            {#each itemGroup.items as item (item)}
                                {@render children(item)}
                            {/each}
                        </div>
                    </section>
                {/if}
            {/each}
        </div>
    {:else}
        <div class={className}>
            {#each sortedItems as item (item)}
                {@render children(item)}
            {/each}
        </div>
    {/if}
{:else if !state.error && empty}
    {@render empty()}
{/if}

{#if state.error}
    <p class="mt-4 text-center text-sm text-red-800" role="alert" aria-live="polite">
        {i18n.t("pagination.error")}
    </p>
{/if}

{#if state.hasMore}
    <div class="mt-8 flex justify-center">
        <button
            type="button"
            class="transition-ui reduce-motion rounded-full border border-primary-dark bg-primary-dark px-6 py-2 text-base text-white hover:bg-white hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            disabled={state.loading}
            aria-busy={state.loading}
            onclick={() => state.loadNext(loadMore)}
        >
            {#if state.loading}
                {i18n.t("pagination.loading")}
            {:else if state.error}
                {i18n.t("pagination.retry")}
            {:else}
                {i18n.t("pagination.loadMore")}
            {/if}
        </button>
    </div>
{/if}
