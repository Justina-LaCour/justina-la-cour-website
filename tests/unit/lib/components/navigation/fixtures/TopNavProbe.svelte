<script lang="ts">
    import TopNav from "$lib/components/navigation/TopNav.svelte";
    import { I18n, provideI18n } from "$lib/i18n/i18n.svelte";
    import fr from "$lib/translations/fr";

    provideI18n(
        new I18n({
            locale: "fr",
            initialMessages: { fr }
        })
    );
</script>

<TopNav />
