import {
    collectFormValidationIssues,
    parseContactForm,
    parseNewsletterForm
} from "$lib/server/formValidation";
import { describe, expect, it } from "vitest";

describe("parseContactForm", () => {
    it("trims valid values and preserves optional metadata", () => {
        const data = new FormData();
        data.set("name", " Person ");
        data.set("email", " person@example.com ");
        data.set("message", " Hello ");
        data.set("phone", " +41 12 345 67 89 ");
        data.set("subject", " Booking ");
        data.set("captchaToken", " token ");

        expect(parseContactForm(data)).toEqual({
            success: true,
            value: {
                name: "Person",
                email: "person@example.com",
                message: "Hello",
                phone: "+41 12 345 67 89",
                subject: "Booking",
                captchaToken: "token"
            }
        });
    });

    it("maps required, invalid, and too-long fields", () => {
        const data = new FormData();
        data.set("name", " ");
        data.set("email", "not-an-email");
        data.set("message", "x".repeat(10_001));
        data.set("phone", "x".repeat(41));
        data.set("captchaToken", " ");

        expect(parseContactForm(data)).toEqual({
            success: false,
            fields: {
                name: "required",
                email: "invalid",
                message: "too_long",
                phone: "too_long",
                captchaToken: "required"
            },
            formIssues: []
        });
    });

    it("converts blank optional fields to undefined", () => {
        const data = new FormData();
        data.set("name", "Person");
        data.set("email", "person@example.com");
        data.set("message", "Hello");
        data.set("phone", " ");
        data.set("subject", "");
        data.set("captchaToken", "token");

        expect(parseContactForm(data)).toMatchObject({
            success: true,
            value: { phone: undefined, subject: undefined }
        });
    });

    it("lets Valibot reject file values without pre-filtering them", () => {
        const data = new FormData();
        data.set("name", new File(["Person"], "name.txt"));
        data.set("email", "person@example.com");
        data.set("message", "Hello");
        data.set("phone", new File(["123"], "phone.txt"));
        data.set("captchaToken", "token");

        expect(parseContactForm(data)).toEqual({
            success: false,
            fields: {
                name: "required",
                phone: "invalid"
            },
            formIssues: []
        });
    });
});

describe("parseNewsletterForm", () => {
    it("accepts an omitted name", () => {
        const data = new FormData();
        data.set("email", "person@example.com");
        data.set("captchaToken", "token");

        expect(parseNewsletterForm(data)).toEqual({
            success: true,
            value: {
                email: "person@example.com",
                name: undefined,
                captchaToken: "token"
            }
        });
    });

    it("validates email, name length, and CAPTCHA token", () => {
        const data = new FormData();
        data.set("email", "invalid");
        data.set("name", "x".repeat(121));

        expect(parseNewsletterForm(data)).toEqual({
            success: false,
            fields: {
                email: "invalid",
                name: "too_long",
                captchaToken: "required"
            },
            formIssues: []
        });
    });
});

describe("collectFormValidationIssues", () => {
    const fields = new Set(["email"] as const);

    it("keeps raw messages for known fields and preserves the first issue", () => {
        expect(collectFormValidationIssues([
            {
                message: "Unexpected Valibot issue",
                path: [{ key: "email" }]
            },
            {
                message: "invalid",
                path: [{ key: "email" }]
            }
        ], fields)).toEqual({
            fields: { email: "Unexpected Valibot issue" },
            formIssues: []
        });
    });

    it("preserves root and unknown-field issues as form issues", () => {
        expect(collectFormValidationIssues([
            { message: "Unexpected root issue" },
            {
                message: "Unexpected field issue",
                path: [{ key: "unknown" }]
            }
        ], fields)).toEqual({
            fields: {},
            formIssues: [
                "Unexpected root issue",
                "Unexpected field issue"
            ]
        });
    });
});
