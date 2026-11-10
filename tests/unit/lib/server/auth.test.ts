import { getBearerAuthenticationErrorResponseIfInvalid } from "$lib/server/auth";
import { describe, expect, it } from "vitest";

describe("getBearerAuthenticationErrorResponseIfInvalid", () => {
    it("rejects missing secret configuration", () => {
        expect(getBearerAuthenticationErrorResponseIfInvalid(null, "")).toEqual({
            error: "Service unavailable",
            status: 503
        });
        expect(getBearerAuthenticationErrorResponseIfInvalid(
            "Bearer ",
            "   "
        )).toEqual({
            error: "Service unavailable",
            status: 503
        });
    });

    it("rejects missing, malformed, and incorrect credentials", () => {
        for (const authorization of [null, "Basic secret", "Bearer wrong"]) {
            expect(getBearerAuthenticationErrorResponseIfInvalid(
                authorization,
                "secret"
            )).toEqual({
                error: "Unauthorized",
                status: 401
            });
        }
    });

    it("accepts the configured bearer credential", () => {
        expect(getBearerAuthenticationErrorResponseIfInvalid(
            "Bearer secret",
            "secret"
        )).toBeNull();
    });
});
