import { dev } from "$app/env";

const SECURITY_HEADERS = {
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
} as const;

export function applySecurityHeaders(
    response: Response,
    requestUrl: URL,
    production = !dev
): Response {
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
        response.headers.set(name, value);
    }

    if (production && requestUrl.protocol === "https:") {
        response.headers.set(
            "strict-transport-security",
            "max-age=31536000; includeSubDomains"
        );
    }

    return response;
}
