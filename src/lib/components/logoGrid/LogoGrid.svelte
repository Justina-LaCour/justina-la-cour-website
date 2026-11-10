<script lang="ts">
    import { safeExternalHttpUrl, safeHttpHref } from "$lib/utils/urls";
    import type { LogoGridItem, LogoGridProps } from "./logoGrid";

    let {
        items,
        showLabels = false,
        class: className = "",
        itemClass = ""
    }: LogoGridProps = $props();
</script>

{#snippet logo(item: LogoGridItem)}
    <img
        src={item.imageUrl}
        alt={showLabels ? "" : item.name}
        width={item.width}
        height={item.height}
        loading="lazy"
        decoding="async"
        class="block h-28 w-full object-contain"
    />
    {#if showLabels}
        <span class="text-center text-sm font-medium">{item.name}</span>
    {/if}
{/snippet}

{#if items.length > 0}
    <ul
        class="grid list-none grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 p-0 {className}"
    >
        {#each items as item}
            {@const href = safeHttpHref(item.href)}
            {@const externalUrl = href ? safeExternalHttpUrl(href) : null}
            <li>
                {#if href}
                    <a
                        {href}
                        target={externalUrl ? "_blank" : undefined}
                        rel={externalUrl ? "noopener noreferrer" : undefined}
                        class="transition-ui reduce-motion flex h-full min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-control-border bg-background p-4 text-foreground no-underline hover:bg-surface {itemClass}"
                    >
                        {@render logo(item)}
                    </a>
                {:else}
                    <div
                        class="flex h-full min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-control-border bg-background p-4 text-foreground {itemClass}"
                    >
                        {@render logo(item)}
                    </div>
                {/if}
            </li>
        {/each}
    </ul>
{/if}
