<script lang="ts">
    import { enhance } from "$app/forms";
    import {
        contactFormFields,
        formActionNames,
        formActionUrl,
        getFormFailureTranslationKey,
        type ContactFormFailure
    } from "$lib/forms";
    import { useI18n } from "$lib/i18n/i18n.svelte";
    import LoadingSpinner from "../utils/LoadingSpinner.svelte";
    import FormField from "./elements/FormField.svelte";
    import FormSuccess from "./elements/FormSuccess.svelte";
    import ReCaptcha from "./elements/ReCaptcha.svelte";
    import {
        createFormSubmit,
        displayFormIssue,
        getCaptchaError,
        type CaptchaWidget,
        type FormState
    } from "./formUtils";

    const i18n = useI18n();
    let formState = $state<FormState<ContactFormFailure>>({ status: "idle" });
    let captcha = $state("");
    let captchaWidget = $state<CaptchaWidget>();
    let formElement = $state<HTMLFormElement>();
    let errorSummary = $state<HTMLDivElement>();

    const translate = (key: string) => i18n.t(key);
    const submit = createFormSubmit({
        captchaField: contactFormFields.captchaToken,
        getCaptcha: () => captcha,
        setState: (state) => {
            formState = state;
        },
        resetCaptcha: () => captchaWidget?.reset(),
        getFormElement: () => formElement,
        getErrorSummary: () => errorSummary
    });
</script>

{#if formState.status === "success"}
    <FormSuccess>{i18n.t("forms.contact.success")}</FormSuccess>
{:else}
    <form
        bind:this={formElement}
        method="POST"
        action={formActionUrl(formActionNames.contact)}
        aria-busy={formState.status === "submitting"}
        use:enhance={submit}
    >
        {#if formState.failure}
            <div
                bind:this={errorSummary}
                class="mb-4 text-red-800"
                role="alert"
                tabindex="-1"
            >
                <p class="text-lg font-semibold">
                    {i18n.t(getFormFailureTranslationKey(formState.failure.code))}
                </p>
                {#each formState.failure.formIssues ?? [] as issue}
                    <p>{displayFormIssue(issue, translate)}</p>
                {/each}
            </div>
        {/if}

        <fieldset
            class="m-0 min-w-0 border-0 p-0"
            disabled={formState.status === "submitting"}
        >
            <FormField
                label={i18n.t("forms.fields.name")}
                name={contactFormFields.name}
                error={displayFormIssue(formState.failure?.fields?.name, translate)}
            >
                {#snippet children(field)}
                    <input
                        class="w-full"
                        id={field.id}
                        name={field.name}
                        aria-invalid={field.invalid}
                        aria-describedby={field.describedBy}
                        type="text"
                    />
                {/snippet}
            </FormField>

            <FormField
                label={i18n.t("forms.fields.email")}
                name={contactFormFields.email}
                error={displayFormIssue(formState.failure?.fields?.email, translate)}
            >
                {#snippet children(field)}
                    <input
                        class="w-full"
                        id={field.id}
                        name={field.name}
                        aria-invalid={field.invalid}
                        aria-describedby={field.describedBy}
                        type="email"
                    />
                {/snippet}
            </FormField>

            <FormField
                label={i18n.t("forms.fields.phone")}
                name={contactFormFields.phone}
                error={displayFormIssue(formState.failure?.fields?.phone, translate)}
            >
                {#snippet children(field)}
                    <input
                        class="w-full"
                        id={field.id}
                        name={field.name}
                        aria-invalid={field.invalid}
                        aria-describedby={field.describedBy}
                        type="tel"
                    />
                {/snippet}
            </FormField>

            <FormField
                label={i18n.t("forms.fields.subject")}
                name={contactFormFields.subject}
                error={displayFormIssue(formState.failure?.fields?.subject, translate)}
            >
                {#snippet children(field)}
                    <input
                        class="w-full"
                        id={field.id}
                        name={field.name}
                        aria-invalid={field.invalid}
                        aria-describedby={field.describedBy}
                        type="text"
                    />
                {/snippet}
            </FormField>

            <FormField
                label={i18n.t("forms.fields.message")}
                name={contactFormFields.message}
                error={displayFormIssue(formState.failure?.fields?.message, translate)}
            >
                {#snippet children(field)}
                    <textarea
                        class="w-full"
                        id={field.id}
                        name={field.name}
                        aria-invalid={field.invalid}
                        aria-describedby={field.describedBy}
                        rows="10"
                    ></textarea>
                {/snippet}
            </FormField>

            <ReCaptcha
                bind:this={captchaWidget}
                bind:captcha
                error={getCaptchaError(
                    formState.failure,
                    contactFormFields.captchaToken,
                    translate
                )}
            />

            <button
                class="transition-ui reduce-motion rounded-full border border-primary-dark bg-primary-dark px-6 py-2 text-base text-white hover:bg-white hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!captcha}
            >
                {i18n.t("forms.contact.submit")}
            </button>
        </fieldset>

        {#if formState.status === "submitting"}
            <LoadingSpinner
                class="mt-6"
                message={i18n.t("forms.contact.sending")}
            />
        {/if}
    </form>
{/if}
