<script lang="ts">
    import { PUBLIC_RECAPTCHA_SITEKEY } from "$app/env/public";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import { onMount } from "svelte";
    import { loadRecaptcha, type RecaptchaApi } from "./recaptcha";

    interface Props {
        captcha: string;
        error?: string;
    }

    let { captcha = $bindable(), error }: Props = $props();

    const i18n = useI18n();

    let captchaDiv: HTMLDivElement;
    let api: RecaptchaApi | undefined;
    let widgetId: number | undefined;
    let state = $state<"loading" | "ready" | "failed">("loading");
    let mounted = false;
    let loadVersion = 0;

    function clearCaptcha(): void {
        captcha = "";
    }

    export function reset(): void {
        clearCaptcha();

        if (api && widgetId !== undefined) {
            api.reset(widgetId);
            state = "ready";
        }
    }

    function handleWidgetError(): void {
        clearCaptcha();
        state = "failed";
    }

    export async function retry(): Promise<void> {
        const requestVersion = ++loadVersion;
        state = "loading";
        clearCaptcha();

        try {
            const loadedApi = await loadRecaptcha();
            if (!mounted || requestVersion !== loadVersion) return;

            api = loadedApi;
            if (widgetId === undefined) {
                widgetId = api.render(captchaDiv, {
                    sitekey: PUBLIC_RECAPTCHA_SITEKEY,
                    callback: (token) => {
                        captcha = token;
                        state = "ready";
                    },
                    "expired-callback": clearCaptcha,
                    "error-callback": handleWidgetError
                });
            } else {
                api.reset(widgetId);
            }

            state = "ready";
        } catch {
            if (!mounted || requestVersion !== loadVersion) return;
            state = "failed";
        }
    }

    onMount(() => {
        mounted = true;
        void retry();

        return () => {
            mounted = false;
            loadVersion += 1;
        };
    });
</script>

<div class="my-4" aria-busy={state === "loading"}>
    <div bind:this={captchaDiv}></div>

    {#if state === "loading"}
        <p role="status" aria-live="polite">
            {i18n.t("forms.captcha.loading")}
        </p>
    {:else if state === "failed"}
        <div role="alert" class="space-y-2 text-red-800">
            <p>{i18n.t("forms.captcha.unavailable")}</p>
            <button
                type="button"
                class="transition-ui reduce-motion rounded-full border border-primary-dark bg-white px-4 py-1.5 text-primary-dark hover:bg-primary-dark hover:text-white"
                onclick={retry}
            >
                {i18n.t("forms.captcha.retry")}
            </button>
        </div>
    {/if}

    {#if error}
        <p role="alert" class="mt-2 text-red-800">{error}</p>
    {/if}
</div>
