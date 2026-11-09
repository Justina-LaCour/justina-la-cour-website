import type { ArtkytError } from "$lib/artkyt/client";
import type { Result } from "$lib/artkyt/result";
import { error } from "@sveltejs/kit";

function logFailure(context: string, failure: ArtkytError): void {
    console.error("Artkyt request failed", {
        context,
        code: failure.code,
        status: failure.status
    });
}

export function requireArtkyt<T>(
    result: Result<T, ArtkytError>,
    context: string,
    { missingIsNotFound = false } = {}
): T {
    if (result.success) return result.value;

    logFailure(context, result.error);

    if (result.error.code === "configuration") {
        error(500, "Content not configured", {
            translationKey: "errorPage.configuration"
        });
    }

    if (missingIsNotFound && (result.error.status === 404 || result.error.code === "http_404")) {
        error(404, "Content not found", { translationKey: "errorPage.notFound" });
    }

    error(503, "Content unavailable", {
        translationKey: "errorPage.contentUnavailable"
    });
}

export function optionalArtkyt<T>(
    result: Result<T, ArtkytError>,
    fallback: T,
    context: string
): T {
    if (result.success) return result.value;

    logFailure(context, result.error);
    return fallback;
}
