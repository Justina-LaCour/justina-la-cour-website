<script lang="ts">
    import { untrack } from "svelte";
    import type { APIConcert } from "$lib/artkyt/types";
    import ConcertDetails from "$lib/components/concert/ConcertDetails.svelte";
    import { I18n, provideI18n } from "$lib/i18n/i18n.svelte";
    import en from "$lib/translations/en";
    import fr from "$lib/translations/fr";
    import de from "$tests/support/translations/de";

    let { concert, locale = "fr" }: {
        concert: APIConcert;
        locale?: "fr" | "en" | "de";
    } = $props();

    provideI18n(new I18n({
        locale: untrack(() => locale),
        initialMessages: { fr, en, de }
    }));
</script>

<ConcertDetails {concert} />
