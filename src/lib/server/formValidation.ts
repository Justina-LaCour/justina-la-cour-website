import {
    contactFormFields,
    newsletterFormFields,
    type ContactFormField,
    type ContactFormInput,
    type FormFieldIssue,
    type FormParseResult,
    type FormValidationIssues,
    type NewsletterFormField,
    type NewsletterFormInput
} from "$lib/forms";
import * as v from "valibot";

const ContactFormSchema = v.object(
    {
        name: requiredText(120),
        email: email(),
        message: requiredText(10_000),
        phone: optionalText(40),
        subject: optionalText(200),
        captchaToken: requiredText(4_096)
    },
    "required"
);

const NewsletterFormSchema = v.object(
    {
        email: email(),
        name: optionalText(120),
        captchaToken: requiredText(4_096)
    },
    "required"
);

const contactFormFieldSet = new Set<ContactFormField>(
    Object.values(contactFormFields)
);
const newsletterFormFieldSet = new Set<NewsletterFormField>(
    Object.values(newsletterFormFields)
);

export function parseContactForm(
    data: FormData
): FormParseResult<ContactFormInput, ContactFormField> {
    return parse(
        ContactFormSchema,
        Object.fromEntries(data),
        contactFormFieldSet
    );
}

export function parseNewsletterForm(
    data: FormData
): FormParseResult<NewsletterFormInput, NewsletterFormField> {
    return parse(
        NewsletterFormSchema,
        Object.fromEntries(data),
        newsletterFormFieldSet
    );
}

function requiredText(maxLength: number) {
    return v.pipe(
        v.string("required"),
        v.trim(),
        v.nonEmpty("required"),
        v.maxLength(maxLength, "too_long")
    );
}

function email() {
    return v.pipe(
        v.string("required"),
        v.trim(),
        v.nonEmpty("required"),
        v.maxLength(254, "too_long"),
        v.email("invalid")
    );
}

function optionalText(maxLength: number) {
    return v.optional(
        v.pipe(
            v.string("invalid"),
            v.trim(),
            v.maxLength(maxLength, "too_long"),
            v.transform((value) => value || undefined)
        )
    );
}

function parse<
    const Schema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
    Field extends string
>(
    schema: Schema,
    input: unknown,
    knownFields: ReadonlySet<Field>
): FormParseResult<v.InferOutput<Schema>, Field> {
    const parsed = v.safeParse(schema, input, { abortPipeEarly: true });
    if (parsed.success) {
        return { success: true, value: parsed.output };
    }

    return {
        success: false,
        ...collectFormValidationIssues(parsed.issues, knownFields)
    };
}

interface ValidationIssueMessage {
    message: string;
    path?: readonly { key: unknown }[];
}

export function collectFormValidationIssues<Field extends string>(
    issues: readonly ValidationIssueMessage[],
    knownFields: ReadonlySet<Field>
): FormValidationIssues<Field> {
    const fields: Partial<Record<Field, FormFieldIssue>> = {};
    const formIssues: FormFieldIssue[] = [];

    for (const issue of issues) {
        const field = issue.path?.[0]?.key;

        if (isKnownField(field, knownFields)) {
            fields[field] ??= issue.message;
        } else {
            formIssues.push(issue.message);
        }
    }

    return { fields, formIssues };
}

function isKnownField<Field extends string>(
    value: unknown,
    knownFields: ReadonlySet<Field>
): value is Field {
    return typeof value === "string" && knownFields.has(value as Field);
}
