<script module lang="ts">
    export type StrongButtonStyle = Partial<Record<"url" | "email" | "phone", boolean>>;
</script>

<script lang="ts">
    import type { Snippet } from "svelte";
    import type { PerformanceBookingInfo } from "$lib/artkyt/types";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import { safeExternalHttpUrl } from "$lib/utils/urls";

    interface Props {
        performance: PerformanceBookingInfo;
        urlLabel?: string;
        strongButtonStyle?: StrongButtonStyle;
        strongButtonClass?: string;
        normalButtonClass?: string;
        class?: string;
        children?: Snippet;
    }

    interface BookingButton {
        key: keyof StrongButtonStyle;
        href: string;
        label: string;
    }

    let {
        performance,
        urlLabel,
        strongButtonStyle = {},
        strongButtonClass = "border-navigation-background bg-navigation-background text-white hover:bg-background hover:text-navigation-background",
        normalButtonClass = "border-primary-dark bg-background text-primary-dark hover:bg-primary-dark hover:text-white",
        class: className = "",
        children
    }: Props = $props();
    const i18n = useI18n();

    let buttons = $derived.by(() => {
        const url = safeExternalHttpUrl(performance.bookingUrl);
        const email = performance.bookingEmail?.trim();
        const phone = performance.bookingPhone?.trim();
        const buttons: BookingButton[] = [];

        if (url) {
            buttons.push({
                key: "url",
                href: url.href,
                label: urlLabel ?? i18n.t("concerts.bookOnline")
            });
        }

        if (email) {
            buttons.push({
                key: "email",
                href: `mailto:${encodeURIComponent(email)}`,
                label: i18n.t("concerts.bookByEmail")
            });
        }

        if (phone) {
            buttons.push({
                key: "phone",
                href: `tel:${encodeURIComponent(phone.replace(/[\s().-]/g, ""))}`,
                label: i18n.t("concerts.bookByPhone")
            });
        }

        return buttons;
    });

    const baseClass = "transition-ui reduce-motion inline-flex min-w-0 justify-center rounded-full border px-5 py-2 text-sm font-semibold wrap-anywhere";
</script>

{#if children || buttons.length > 0}
    <div class={`flex flex-wrap items-center gap-4 ${className}`.trim()}>
        {#each buttons as button (button.key)}
            <a
                href={button.href}
                target={button.key === "url" ? "_blank" : undefined}
                rel={button.key === "url" ? "noopener noreferrer" : undefined}
                class={`${baseClass} ${strongButtonStyle[button.key] ? strongButtonClass : normalButtonClass}`}
            >
                {button.label}
            </a>
        {/each}

        {@render children?.()}
    </div>
{/if}
