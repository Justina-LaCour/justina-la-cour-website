import {
    failure,
    ok,
    type BaseError,
    type Result
} from "$lib/artkyt/result";
import { isValidTimeoutMs } from "$lib/utils/timeouts";
import * as v from "valibot";

const DEFAULT_RECAPTCHA_TIMEOUT_MS = 5_000;

const RecaptchaResponseSchema = v.object({
    success: v.boolean(),
    challenge_ts: v.optional(v.string()),
    hostname: v.optional(v.string()),
    "error-codes": v.optional(v.array(v.string()))
});

export type RecaptchaResponse = v.InferOutput<typeof RecaptchaResponseSchema>;

export type RecaptchaErrorCode =
    | "rejected"
    | "hostname_mismatch"
    | "network"
    | "http"
    | "invalid_response"
    | "configuration";

export interface RecaptchaError extends BaseError<RecaptchaErrorCode> {
    status?: number;
}

export interface RecaptchaVerification {
    hostname: string;
    challengeTimestamp?: string;
}

export type RecaptchaVerificationResult = Result<
    RecaptchaVerification,
    RecaptchaError
>;

interface VerifyRecaptchaOptions {
    token: string;
    secretKey: string;
    allowedHostnames: ReadonlySet<string>;
    timeoutMs?: number;
    fetch?: typeof globalThis.fetch;
}

export async function verifyRecaptcha({
    token,
    secretKey,
    allowedHostnames,
    timeoutMs = DEFAULT_RECAPTCHA_TIMEOUT_MS,
    fetch: fetcher = globalThis.fetch
}: VerifyRecaptchaOptions): Promise<RecaptchaVerificationResult> {
    if (!secretKey.trim() || allowedHostnames.size === 0) {
        return failure({
            code: "configuration",
            message: "reCAPTCHA is not configured"
        });
    }
    if (!isValidTimeoutMs(timeoutMs)) {
        return failure({
            code: "configuration",
            message: "reCAPTCHA timeout must be a valid positive integer"
        });
    }

    let response: Response;

    try {
        response = await fetcher(
            "https://www.google.com/recaptcha/api/siteverify",
            {
                method: "POST",
                signal: AbortSignal.timeout(timeoutMs),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    secret: secretKey,
                    response: token
                })
            }
        );
    } catch {
        return failure({
            code: "network",
            message: "Unable to reach reCAPTCHA"
        });
    }

    if (!response.ok) {
        return failure({
            code: "http",
            status: response.status,
            message: "reCAPTCHA returned an unsuccessful response"
        });
    }

    let recaptchaResponse: RecaptchaResponse;
    try {
        const body = await response.json();
        recaptchaResponse = v.parse(RecaptchaResponseSchema, body);
    } catch {
        return failure({
            code: "invalid_response",
            status: response.status,
            message: "reCAPTCHA returned invalid JSON or invalid shape"
        });
    }

    if (!recaptchaResponse.success) {
        return failure({
            code: "rejected",
            message: "reCAPTCHA rejected the challenge"
        });
    }

    const hostname = recaptchaResponse.hostname?.toLowerCase();
    if (!hostname || !allowedHostnames.has(hostname)) {
        return failure({
            code: "hostname_mismatch",
            message: "reCAPTCHA hostname did not match"
        });
    }

    return ok({
        hostname,
        challengeTimestamp: recaptchaResponse.challenge_ts
    });
}
