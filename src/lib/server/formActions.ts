import {
    RECAPTCHA_SECRET_KEY,
    SITE_HOSTNAMES
} from "$app/env/private";
import { artkytClient } from "$lib/artkyt";
import type {
    FormFailure,
    FormFailureCode
} from "$lib/forms";
import {
    parseContactForm
} from "$lib/server/formValidation";
import {
    verifyRecaptcha,
    type RecaptchaErrorCode
} from "$lib/server/recaptcha";
import { parseSiteHostnames } from "$lib/server/siteHostnames";
import { fail, type Action } from "@sveltejs/kit";

function verifyCaptchaToken(token: string, fetchFunction = fetch) {
    return verifyRecaptcha({
        token,
        secretKey: RECAPTCHA_SECRET_KEY,
        allowedHostnames: parseSiteHostnames(SITE_HOSTNAMES),
        fetch: fetchFunction
    });
}

function publicFailure(
    httpCode: number,
    failureCode: FormFailureCode,
    extra?: object
) {
    return fail(httpCode, {
        success: false,
        code: failureCode,
        ...extra
    } as FormFailure<string>);
}

function captchaFailure(code: RecaptchaErrorCode) {
    if (code === "rejected" || code === "hostname_mismatch") {
        return publicFailure(400, "captcha_rejected");
    }
    if (code === "configuration") {
        return publicFailure(503, "configuration");
    }

    return publicFailure(502, "captcha_unavailable");
}

export const contact: Action = async ({ request, fetch }) => {
    try {
        const parsed = parseContactForm(await request.formData());
        if (!parsed.success) {
            return publicFailure(422, "validation", {
                fields: parsed.fields,
                formIssues: parsed.formIssues
            });
        }

        const captchaResult = await verifyCaptchaToken(
            parsed.value.captchaToken,
            fetch
        );
        if (!captchaResult.success) {
            return captchaFailure(captchaResult.error.code);
        }

        const result = await artkytClient.postContactMessage(
            {
                fromName: parsed.value.name,
                fromEmail: parsed.value.email,
                fromPhone: parsed.value.phone,
                subject: parsed.value.subject,
                content: parsed.value.message
            },
            { fetch }
        );

        if (!result.success) {
            return result.error.code === "configuration"
                ? publicFailure(503, "configuration")
                : publicFailure(502, "upstream");
        }
    } catch (error) {
        console.error("Contact form action failed", error);
        return publicFailure(500, "internal");
    }

    return { success: true };
};
