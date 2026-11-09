<script lang="ts">
    import { onNavigate } from "$app/navigation";
    import type { Snippet } from "svelte";
    import { languageCodeToLanguage, type LanguageCode } from "$lib/artkyt/constants/languages";
    import { ARTKYT_ORIGIN } from "$lib/artkyt/constants/urls";
    import { useI18n } from "$lib/i18n/i18n.svelte";

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();

    const i18n = useI18n();
    let popover: HTMLDivElement;
    let barOpen = $state(false);

    let currentFlag = $derived(
        languageCodeToLanguage[i18n.locale as LanguageCode]?.flagUrl ?? "/icons/english.svg"
    );

    function handleToggle(event: ToggleEvent): void {
        barOpen = event.newState === "open";
    }

    onNavigate(() => {
        if (popover?.matches(":popover-open")) {
            popover.hidePopover();
        }
    });
</script>

<button
    type="button"
    class="transition-ui reduce-motion group -m-2 flex items-center gap-2 rounded-xl p-2 text-lg text-navigation-foreground hover:bg-background/50"
    aria-label={i18n.t("nav.chooseLanguage")}
    aria-controls="language-picker"
    aria-expanded={barOpen}
    popovertarget="language-picker"
    popovertargetaction="toggle"
>
    <img
        class="transition-ui reduce-motion h-5 opacity-80 group-hover:opacity-100"
        src={ARTKYT_ORIGIN + currentFlag}
        alt=""
    />
    &#9662;
</button>

<div
    bind:this={popover}
    id="language-picker"
    class="language-picker-popover rounded-2xl bg-background/85 p-2 backdrop-blur-3xl"
    popover="auto"
    ontoggle={handleToggle}
>
    {@render children?.()}
</div>

<style>
    .language-picker-popover {
        position: fixed;
        inset: 4rem 0.5rem auto auto;
        margin: 0;
        border: 0;
        opacity: 0;
        transition:
            opacity var(--transition-duration-ui),
            overlay var(--transition-duration-ui) allow-discrete,
            display var(--transition-duration-ui) allow-discrete;
    }

    .language-picker-popover:popover-open {
        opacity: 1;
    }

    @starting-style {
        .language-picker-popover:popover-open {
            opacity: 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .language-picker-popover {
            transition: none;
        }
    }
</style>
