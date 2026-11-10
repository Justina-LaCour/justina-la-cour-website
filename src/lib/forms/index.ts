import { resolve } from "$app/paths";

export const formActionNames = {
    contact: "contact",
    newsletter: "newsletter"
} as const;

export type FormActionName =
    (typeof formActionNames)[keyof typeof formActionNames];

export function formActionUrl(action: FormActionName): string {
    return `${resolve("/(infrastructure)/actions/forms")}?/${action}`;
}

export const contactFormFields = {
    name: "name",
    email: "email",
    phone: "phone",
    subject: "subject",
    message: "message",
    captchaToken: "captchaToken"
} as const;

export const newsletterFormFields = {
    name: "name",
    email: "email",
    captchaToken: "captchaToken"
} as const;

export type ContactFormField =
    (typeof contactFormFields)[keyof typeof contactFormFields];
export type NewsletterFormField =
    (typeof newsletterFormFields)[keyof typeof newsletterFormFields];

export interface ContactFormInput {
    name: string;
    email: string;
    message: string;
    phone?: string;
    subject?: string;
    captchaToken: string;
}

export interface NewsletterFormInput {
    email: string;
    name?: string;
    captchaToken: string;
}

export const formIssueTranslationKeys = {
    required: "forms.errors.required",
    invalid: "forms.errors.invalid",
    too_long: "forms.errors.tooLong"
} as const;

export type TranslatableFormIssue = keyof typeof formIssueTranslationKeys;
export type FormIssueTranslationKey =
    (typeof formIssueTranslationKeys)[TranslatableFormIssue];
export type FormFieldIssue = string;

export function getFormIssueTranslationKey(
    issue: string
): FormIssueTranslationKey | undefined {
    if (!Object.hasOwn(formIssueTranslationKeys, issue)) {
        return undefined;
    }

    return formIssueTranslationKeys[issue as TranslatableFormIssue];
}

export type FormFailureCode =
    | "validation"
    | "captcha_rejected"
    | "captcha_unavailable"
    | "upstream"
    | "configuration"
    | "internal";

export const formFailureTranslationKeys = {
    validation: "forms.errors.validation",
    captcha_rejected: "forms.errors.captchaRejected",
    captcha_unavailable: "forms.errors.captchaUnavailable",
    upstream: "forms.errors.upstream",
    configuration: "forms.errors.configuration",
    internal: "forms.errors.generic"
} as const satisfies Record<FormFailureCode, string>;

export type FormFailureTranslationKey =
    (typeof formFailureTranslationKeys)[FormFailureCode];

export function getFormFailureTranslationKey(
    code: FormFailureCode
): FormFailureTranslationKey {
    return formFailureTranslationKeys[code];
}

export interface FormFailure<Field extends string> {
    success: false;
    code: FormFailureCode;
    fields?: Partial<Record<Field, FormFieldIssue>>;
    formIssues?: FormFieldIssue[];
}

export interface FormSuccess {
    success: true;
}

export type ContactFormFailure = FormFailure<ContactFormField>;
export type NewsletterFormFailure = FormFailure<NewsletterFormField>;

export interface FormValidationIssues<Field extends string> {
    fields: Partial<Record<Field, FormFieldIssue>>;
    formIssues: FormFieldIssue[];
}

export type FormParseResult<T, Field extends string> =
    | { success: true; value: T }
    | ({ success: false } & FormValidationIssues<Field>);
