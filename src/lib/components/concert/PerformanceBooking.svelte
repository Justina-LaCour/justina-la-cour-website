<script lang="ts">
    import { formatPerformancePrice } from "$lib/artkyt/concerts";
    import type { FormattedPerformance } from "$lib/artkyt/types";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import BookingButtonRow from "./BookingButtonRow.svelte";

    interface Props {
        performance: FormattedPerformance;
    }

    let { performance }: Props = $props();
    const i18n = useI18n();

    let price = $derived(formatPerformancePrice(i18n.locale, performance));
    let admissionLabel = $derived.by(() => {
        switch (performance.pricingType) {
            case "paid":
                return price;
            case "free":
                return i18n.t("concerts.freeAdmission");
            case "donation":
                return i18n.t("concerts.donationAdmission");
            default:
                return null;
        }
    });

    let notes = $derived(performance.notes?.trim());
</script>

{#if admissionLabel || notes}
    <div class="mt-3 flex flex-col gap-3 text-foreground">
        {#if admissionLabel}
            <p class="m-0">{admissionLabel}</p>

            {#if performance.pricingType === "donation" && price}
                <p class="m-0">
                    {i18n.t("concerts.suggestedDonation", { price })}
                </p>
            {/if}
        {/if}

        {#if notes}
            <p class="m-0 whitespace-pre-wrap wrap-anywhere">{notes}</p>
        {/if}
    </div>
{/if}

<BookingButtonRow
    {performance}
    strongButtonStyle={{ url: true, email: true }}
    class="mt-3"
/>
