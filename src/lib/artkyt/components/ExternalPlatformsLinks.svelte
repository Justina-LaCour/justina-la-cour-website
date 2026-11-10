<script lang="ts">
    import { safeExternalHttpUrl } from "$lib/utils/urls";
    import {
        isSocialPlatform,
        socialPlatformCodeToPlatform
    } from "../constants/externalPlatforms";
    import { ARTKYT_ORIGIN } from "../constants/urls";
    import type { ArtkytProfileLink } from "../types";

    interface Props {
        links: ArtkytProfileLink[];
        text?: "media" | "handles" | "off";
        bigIcons?: boolean;
    }

    let { links, text = "off", bigIcons = false }: Props = $props();

    const iconHeight = $derived(bigIcons ? 40 : 32);

    let safeLinks = $derived(links.flatMap((link) => {
        if (!isSocialPlatform(link.kind)) return [];

        const url = safeExternalHttpUrl(link.value);
        if (!url) return [];

        return [{
            link,
            href: url.href,
            platform: socialPlatformCodeToPlatform[link.kind]
        }];
    }));
</script>

<ul class="flex list-none p-0 m-0 gap-2">
    {#each safeLinks as { link, href, platform }}
        {@const iconWidth = Math.round(
            iconHeight * platform.icon.width / platform.icon.height
        )}
        <li>
            <a
                {href}
                target="_blank"
                rel="noopener noreferrer"
                class="transition-ui reduce-motion flex flex-col justify-center gap-2 rounded-md p-1 text-black no-underline hover:bg-white/25"
            >
                <img
                    src={ARTKYT_ORIGIN + platform.icon.url}
                    alt={platform.label}
                    width={iconWidth}
                    height={iconHeight}
                    loading="lazy"
                    decoding="async"
                    class={bigIcons ? "block h-10" : "block h-8"}
                />

                {#if text === "handles"}
                    <span>{link.value}</span>
                {:else if text === "media"}
                    <span>{platform.label}</span>
                {/if}
            </a>
        </li>
    {/each}
</ul>
