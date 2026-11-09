<script lang="ts">
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import { readableCodeLabel } from "$lib/utils/text";

    interface Props {
        categories: readonly string[];
        selected: string | null;
    }

    let { categories, selected = $bindable() }: Props = $props();
    const i18n = useI18n();

    function categoryLabel(category: string): string {
        const key = `compositions.categories.${category}`;
        const translation = i18n.t(key);

        return translation === key ? readableCodeLabel(category) : translation;
    }
</script>

{#if categories.length > 0}
    <div
        class="mb-10 flex flex-wrap gap-2"
        role="group"
        aria-label={i18n.t("compositions.filterLabel")}
    >
        <button
            type="button"
            class="transition-ui reduce-motion rounded-full border px-4 py-1.5"
            class:border-primary-dark={selected === null}
            class:bg-primary-dark={selected === null}
            class:text-white={selected === null}
            class:border-control-border={selected !== null}
            onclick={() => (selected = null)}
        >
            {i18n.t("compositions.allCategories")}
        </button>

        {#each categories as category}
            <button
                type="button"
                class="transition-ui reduce-motion rounded-full border px-4 py-1.5"
                class:border-primary-dark={selected === category}
                class:bg-primary-dark={selected === category}
                class:text-white={selected === category}
                class:border-control-border={selected !== category}
                onclick={() => (selected = category)}
            >
                {categoryLabel(category)}
            </button>
        {/each}
    </div>
{/if}
