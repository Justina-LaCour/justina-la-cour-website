import { verifyRecaptcha } from "$lib/server/recaptcha";
import { describe, expect, it, vi } from "vitest";

const allowedHostnames = new Set(["example.com"]);

describe("verifyRecaptcha", () => {
    it("rejects missing configuration without fetching", async () => {
        const fetcher = vi.fn();

        const missingSecret = await verifyRecaptcha({
            token: "token",
            secretKey: " ",
            allowedHostnames,
            fetch: fetcher
        });
        const missingHostnames = await verifyRecaptcha({
            token: "token",
            secretKey: "secret",
            allowedHostnames: new Set(),
            fetch: fetcher
        });

        expect(missingSecret).toMatchObject({
            success: false,
            error: { code: "configuration" }
        });
        expect(missingHostnames).toMatchObject({
            success: false,
            error: { code: "configuration" }
        });
        expect(fetcher).not.toHaveBeenCalled();
    });

    it.each([
        0,
        1.5,
        Number.POSITIVE_INFINITY,
        2 ** 31
    ])("rejects invalid timeout %s without fetching", async (timeoutMs) => {
        const fetcher = vi.fn();

        const result = await verifyRecaptcha({
            token: "token",
            secretKey: "secret",
            allowedHostnames,
            timeoutMs,
            fetch: fetcher
        });

        expect(result).toMatchObject({
            success: false,
            error: { code: "configuration" }
        });
        expect(fetcher).not.toHaveBeenCalled();
    });

    it("returns a validated successful verification", async () => {
        const fetcher = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => Response.json({
            success: true,
            hostname: "Example.com",
            challenge_ts: "2026-08-09T10:00:00Z"
        }));

        const result = await verifyRecaptcha({
            token: "captcha-token",
            secretKey: "secret-key",
            allowedHostnames,
            fetch: fetcher
        });

        expect(result).toEqual({
            success: true,
            value: {
                hostname: "example.com",
                challengeTimestamp: "2026-08-09T10:00:00Z"
            }
        });
        expect(fetcher).toHaveBeenCalledOnce();

        const request = fetcher.mock.calls[0][1];
        expect(request).toMatchObject({
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        expect(String(request?.body)).toContain("secret=secret-key");
        expect(String(request?.body)).toContain("response=captcha-token");
    });

    it("distinguishes rejection from hostname mismatch", async () => {
        const rejected = await verifyRecaptcha({
            token: "token",
            secretKey: "secret",
            allowedHostnames,
            fetch: vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => Response.json({
                success: false,
                "error-codes": ["invalid-input-response"]
            }))
        });
        const mismatch = await verifyRecaptcha({
            token: "token",
            secretKey: "secret",
            allowedHostnames,
            fetch: vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => Response.json({
                success: true,
                hostname: "attacker.example"
            }))
        });

        expect(rejected).toMatchObject({
            success: false,
            error: { code: "rejected" }
        });
        expect(mismatch).toMatchObject({
            success: false,
            error: { code: "hostname_mismatch" }
        });
    });

    it("retains unsuccessful HTTP status", async () => {
        const result = await verifyRecaptcha({
            token: "token",
            secretKey: "secret",
            allowedHostnames,
            fetch: vi.fn(async () => new Response("Unavailable", {
                status: 503
            }))
        });

        expect(result).toMatchObject({
            success: false,
            error: { code: "http", status: 503 }
        });
    });

    it("rejects invalid JSON and invalid response shapes", async () => {
        const invalidJson = await verifyRecaptcha({
            token: "token",
            secretKey: "secret",
            allowedHostnames,
            fetch: vi.fn(async () => new Response("not-json"))
        });
        const invalidShape = await verifyRecaptcha({
            token: "token",
            secretKey: "secret",
            allowedHostnames,
            fetch: vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => Response.json({ success: "yes" }))
        });

        expect(invalidJson).toMatchObject({
            success: false,
            error: { code: "invalid_response" }
        });
        expect(invalidShape).toMatchObject({
            success: false,
            error: { code: "invalid_response" }
        });
    });

    it("normalizes network failures and timeouts", async () => {
        const network = await verifyRecaptcha({
            token: "token",
            secretKey: "secret",
            allowedHostnames,
            fetch: vi.fn(async () => {
                throw new Error("private network details");
            })
        });

        vi.useFakeTimers();
        const timedOut = verifyRecaptcha({
            token: "token",
            secretKey: "secret",
            allowedHostnames,
            timeoutMs: 100,
            fetch: vi.fn((_input, init) => new Promise<Response>((_resolve, reject) => {
                init?.signal?.addEventListener("abort", () => {
                    reject(new DOMException("Aborted", "AbortError"));
                });
            }))
        });
        await vi.advanceTimersByTimeAsync(100);

        expect(network).toMatchObject({
            success: false,
            error: { code: "network" }
        });
        await expect(timedOut).resolves.toMatchObject({
            success: false,
            error: { code: "network" }
        });
    });
});
