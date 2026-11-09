import {
    createFormSubmit,
    displayFormIssue,
    getCaptchaError,
    type FormState
} from "$lib/components/forms/formUtils";
import type { ContactFormFailure } from "$lib/forms";
import { describe, expect, it, vi } from "vitest";

const translate = (key: string) => `translated:${key}`;

describe("form utilities", () => {
    it("translates known issues and preserves server-provided messages", () => {
        expect(displayFormIssue("required", translate)).toBe(
            "translated:forms.errors.required"
        );
        expect(displayFormIssue("Custom server message", translate)).toBe(
            "Custom server message"
        );
        expect(displayFormIssue(undefined, translate)).toBeUndefined();
    });

    it("prefers a CAPTCHA field issue over a rejected-CAPTCHA fallback", () => {
        const failure: ContactFormFailure = {
            success: false,
            code: "captcha_rejected",
            fields: { captchaToken: "required" }
        };

        expect(getCaptchaError(failure, "captchaToken", translate)).toBe(
            "translated:forms.errors.required"
        );
        expect(
            getCaptchaError(
                { success: false, code: "captcha_rejected" },
                "captchaToken",
                translate
            )
        ).toBe("translated:forms.errors.captchaRejected");
    });

    it("centralizes enhanced submission and preserves values after failure", async () => {
        const states: FormState<ContactFormFailure>[] = [];
        const resetCaptcha = vi.fn();
        const focus = vi.fn();
        const update = vi.fn(async () => {});
        const formData = new FormData();
        const submit = createFormSubmit({
            captchaField: "captchaToken",
            getCaptcha: () => "captcha-response",
            setState: (state) => states.push(state),
            resetCaptcha,
            getFormElement: () => undefined,
            getErrorSummary: () => ({ focus }) as unknown as HTMLElement
        });

        const handleResult = await submit({ formData } as never);
        await handleResult?.({
            result: {
                type: "failure",
                status: 400,
                data: {
                    success: false,
                    code: "validation",
                    fields: { email: "invalid" }
                }
            },
            update
        } as never);

        expect(formData.get("captchaToken")).toBe("captcha-response");
        expect(states).toEqual([
            { status: "submitting" },
            {
                status: "idle",
                failure: {
                    success: false,
                    code: "validation",
                    fields: { email: "invalid" }
                }
            }
        ]);
        expect(resetCaptcha).toHaveBeenCalledOnce();
        expect(update).toHaveBeenCalledWith({
            navigate: false,
            reset: false,
            refreshAll: false
        });
        expect(focus).toHaveBeenCalledOnce();
    });
});
