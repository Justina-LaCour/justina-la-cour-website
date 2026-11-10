export type BearerAuthenticationError = { error: "Service unavailable" | "Unauthorized", status: number };

export function getBearerAuthenticationErrorResponseIfInvalid(authorization: string | null, secret: string): BearerAuthenticationError | null {
    if (!secret.trim()) {
        return {
            error: "Service unavailable",
            status: 503
        };
    }

    if (authorization !== `Bearer ${secret}`) {
        return {
            error: "Unauthorized",
            status: 401
        };
    }

    return null;
}