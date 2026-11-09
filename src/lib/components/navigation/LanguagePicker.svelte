<script lang="ts">
    import { resolve } from "$app/paths";
    import { page } from "$app/state";
    import { languageCodeToLanguage, type LanguageCode } from "$lib/artkyt/constants/languages";
    import { ARTKYT_ORIGIN } from "$lib/artkyt/constants/urls";

    interface Props {
        supportedLanguages: readonly LanguageCode[];
    }

    let { supportedLanguages }: Props = $props();

    function languageUrl(language: LanguageCode) {
        // @ts-expect-error SvelteKit cannot correlate a runtime route with its params.
        return resolve(page.route.id!, {
            ...page.params,
            lang: language
        });
    }

</script>


<div class="flex gap-4">
    {#each supportedLanguages as code}
        {@const language = languageCodeToLanguage[code]}
        <a href={languageUrl(code)} class="transition-ui reduce-motion flex flex-col items-center rounded-xl p-2 hover:bg-background/50">
            <img
                src={ARTKYT_ORIGIN + language.flagUrl}
                alt=""
                width="24"
                height="24"
                loading="lazy"
                decoding="async"
                class="size-6"
            />
            <span class="text-sm">{ language.nativeName }</span>
        </a>
    {/each}
</div>
