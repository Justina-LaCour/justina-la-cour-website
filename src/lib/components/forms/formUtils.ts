import { applyAction, type SubmitFunction } from "$app/forms";
import {
    getFormIssueTranslationKey,
    type FormFailure
} from "$lib/forms";
import { tick } from "svelte";

export type FormState<Failure> =
    | { status: "idle" | "submitting"; failure?: Failure }
    | { status: "success" };

export interface CaptchaWidget {
    reset(): void;
}

type Translate = (key: string) => string;

interface FormSubmitOptions<Field extends string> {
    captchaField: Field;
    getCaptcha(): string;
    setState(state: FormState<FormFailure<Field>>): void;
    resetCaptcha(): void;
    getFormElement(): HTMLFormElement | undefined;
    getErrorSummary(): HTMLElement | undefined;
}

export function displayFormIssue(
    issue: string | undefined,
    translate: Translate
): string | undefined {
    if (!issue) return undefined;

    const translationKey = getFormIssueTranslationKey(issue);
    return translationKey ? translate(translationKey) : issue;
}

export function getCaptchaError<Field extends string>(
    failure: FormFailure<Field> | undefined,
    captchaField: Field,
    translate: Translate
): string | undefined {
    const fieldIssue = displayFormIssue(
        failure?.fields?.[captchaField],
        translate
    );
    if (fieldIssue) return fieldIssue;

    return failure?.code === "captcha_rejected"
        ? translate("forms.errors.captchaRejected")
        : undefined;
}

export function createFormSubmit<Field extends string>({
    captchaField,
    getCaptcha,
    setState,
    resetCaptcha,
    getFormElement,
    getErrorSummary
}: FormSubmitOptions<Field>): SubmitFunction {
    return ({ formData }) => {
        setState({ status: "submitting" });
        formData.set(captchaField, getCaptcha());

        return async ({ result, update }) => {
            switch (result.type) {
                case "success":
                    await update({ navigate: false });
                    setState({ status: "success" });
                    return;

                case "failure":
                    setState({
                        status: "idle",
                        failure: (result.data as FormFailure<Field> | undefined) ?? {
                            success: false,
                            code: "internal"
                        }
                    });
                    resetCaptcha();
                    await update({ navigate: false, reset: false, refreshAll: false });
                    await focusFormFailure(
                        getFormElement(),
                        getErrorSummary()
                    );
                    return;

                case "redirect":
                    await applyAction(result);
                    return;

                case "error":
                    setState({
                        status: "idle",
                        failure: { success: false, code: "internal" }
                    });
                    resetCaptcha();
                    await focusFormFailure(
                        getFormElement(),
                        getErrorSummary()
                    );
            }
        };
    };
}

async function focusFormFailure(
    form: HTMLFormElement | undefined,
    errorSummary: HTMLElement | undefined
): Promise<void> {
    await tick();
    const invalidControl = form?.querySelector<HTMLElement>(
        '[aria-invalid="true"]'
    );
    (invalidControl ?? errorSummary)?.focus();
}
