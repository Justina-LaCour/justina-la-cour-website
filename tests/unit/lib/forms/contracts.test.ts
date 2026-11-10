import {
    contactFormFields,
    formActionNames,
    formActionUrl,
    formFailureTranslationKeys,
    formIssueTranslationKeys,
    getFormFailureTranslationKey,
    getFormIssueTranslationKey,
    newsletterFormFields
} from "$lib/forms";
import { describe, expect, it } from "vitest";

describe("form contracts", () => {
    it("builds stable action URLs for the shared form route", () => {
        expect(formActionUrl(formActionNames.contact)).toBe(
            "/actions/forms?/contact"
        );
        expect(formActionUrl(formActionNames.newsletter)).toBe(
            "/actions/forms?/newsletter"
        );
    });

    it("publishes stable contact and newsletter field names", () => {
        expect(contactFormFields).toEqual({
            name: "name",
            email: "email",
            phone: "phone",
            subject: "subject",
            message: "message",
            captchaToken: "captchaToken"
        });
        expect(newsletterFormFields).toEqual({
            name: "name",
            email: "email",
            captchaToken: "captchaToken"
        });
    });

    it("maps known issues to translations and preserves unknown messages", () => {
        expect(formIssueTranslationKeys).toEqual({
            required: "forms.errors.required",
            invalid: "forms.errors.invalid",
            too_long: "forms.errors.tooLong"
        });
        expect(getFormIssueTranslationKey("required")).toBe(
            "forms.errors.required"
        );
        expect(getFormIssueTranslationKey("Unexpected Valibot issue")).toBe(
            undefined
        );
    });

    it("maps every public failure code to specific interface copy", () => {
        expect(formFailureTranslationKeys).toEqual({
            validation: "forms.errors.validation",
            captcha_rejected: "forms.errors.captchaRejected",
            captcha_unavailable: "forms.errors.captchaUnavailable",
            upstream: "forms.errors.upstream",
            configuration: "forms.errors.configuration",
            internal: "forms.errors.generic"
        });
        expect(getFormFailureTranslationKey("captcha_unavailable")).toBe(
            "forms.errors.captchaUnavailable"
        );
    });
});
