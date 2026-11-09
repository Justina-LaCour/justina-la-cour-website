import { beforeEach, describe, expect, it, vi } from "vitest";

const dependencies = vi.hoisted(() => ({
    env: {
        ARTKYT_WEBHOOK_SECRET: "webhook-secret",
        CRON_SECRET: "cron-secret",
        SITE_HOSTNAMES: "example.com,www.example.com",
        ISR_BYPASS_TOKEN: "isr-token"
    },
    fetcher: vi.fn(),
    resolvePayload: vi.fn(),
    triggerRevalidation: vi.fn()
}));

vi.mock("$app/env/private", () => dependencies.env);
vi.mock("$lib/server/isr", () => ({
    triggerRevalidation: dependencies.triggerRevalidation
}));
vi.mock("$lib/config/server/revalidation", () => ({
    revalidationMap: {
        resolvePayload: dependencies.resolvePayload
    }
}));

import { GET, POST } from "$src/routes/api/revalidate/+server";

beforeEach(() => {
    dependencies.env.SITE_HOSTNAMES = "example.com,www.example.com";
    dependencies.env.ISR_BYPASS_TOKEN = "isr-token";
    dependencies.fetcher.mockReset();
    dependencies.resolvePayload.mockReset();
    dependencies.resolvePayload.mockResolvedValue(["/en/bio"]);
    dependencies.triggerRevalidation.mockReset();
    dependencies.triggerRevalidation.mockResolvedValue({
        revalidated: ["/en/bio"],
        failed: []
    });
    vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("revalidation endpoint", () => {
    it("accepts the full-site POST used by make revalidate and reports partial failures", async () => {
        const requestUrl = "https://example.com/api/revalidate";
        dependencies.triggerRevalidation.mockResolvedValue({
            revalidated: ["/en"],
            failed: [{ path: "/fr", status: 503 }]
        });
        const response = await callWebhook(new Request(requestUrl, {
            method: "POST",
            headers: {
                Authorization: "Bearer webhook-secret",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pages: "all" })
        }), requestUrl);

        expect(dependencies.resolvePayload).toHaveBeenCalledWith(
            { pages: "all" }, { fetch: dependencies.fetcher }
        );
        expect(response.status).toBe(502);
        expectNoStore(response);
        await expect(response.json()).resolves.toEqual({
            revalidated: ["/en"],
            failed: [{ path: "/fr", status: 503 }]
        });
    });
    it.each([
        "https://example.com/api/revalidate",
        "https://www.example.com/api/revalidate"
    ])("revalidates an allowed request origin", async (requestUrl) => {
        const response = await callCron(requestUrl);

        expect(response.status).toBe(200);
        expectNoStore(response);
        expect(dependencies.resolvePayload).toHaveBeenCalledWith(
            { pages: "all" },
            { fetch: dependencies.fetcher }
        );
        expect(dependencies.triggerRevalidation).toHaveBeenCalledWith(
            new URL(requestUrl).origin,
            ["/en/bio"],
            "isr-token"
        );
    });

    it("resolves webhook resource changes", async () => {
        const requestUrl = "https://example.com/api/revalidate";
        const resources = {
            concerts: ["first", "second"],
            recordings: "all"
        } as const;
        const request = new Request(requestUrl, {
            method: "POST",
            headers: {
                Authorization: "Bearer webhook-secret",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ resources })
        });

        const response = await POST({
            request,
            url: new URL(requestUrl),
            fetch: dependencies.fetcher
        } as never);

        expect(response.status).toBe(200);
        expectNoStore(response);
        expect(dependencies.resolvePayload).toHaveBeenCalledWith(
            { resources },
            { fetch: dependencies.fetcher }
        );
    });

    it("rejects an unlisted hostname before triggering revalidation", async () => {
        const response = await callCron(
            "https://attacker.example/api/revalidate"
        );

        expect(response.status).toBe(403);
        expectNoStore(response);
        await expect(response.json()).resolves.toEqual({ error: "Forbidden" });
        expect(dependencies.triggerRevalidation).not.toHaveBeenCalled();
    });

    it.each([
        ["", "isr-token"],
        ["https://example.com", "isr-token"],
        ["example.com", " "]
    ])("rejects missing or invalid configuration", async (hostnames, token) => {
        dependencies.env.SITE_HOSTNAMES = hostnames;
        dependencies.env.ISR_BYPASS_TOKEN = token;

        const response = await callCron(
            "https://example.com/api/revalidate"
        );

        expect(response.status).toBe(503);
        expectNoStore(response);
        await expect(response.json()).resolves.toEqual({
            error: "Service unavailable"
        });
        expect(dependencies.triggerRevalidation).not.toHaveBeenCalled();
    });

    it("returns a non-cacheable authentication failure", async () => {
        const requestUrl = "https://example.com/api/revalidate";
        const request = new Request(requestUrl, { method: "POST" });

        const response = await callWebhook(request, requestUrl);

        expect(response.status).toBe(401);
        expectNoStore(response);
        expect(dependencies.resolvePayload).not.toHaveBeenCalled();
        expect(dependencies.triggerRevalidation).not.toHaveBeenCalled();
    });

    it("returns 400 with no-store for malformed JSON", async () => {
        const requestUrl = "https://example.com/api/revalidate";
        const request = new Request(requestUrl, {
            method: "POST",
            headers: {
                Authorization: "Bearer webhook-secret",
                "Content-Type": "application/json"
            },
            body: "{"
        });

        const response = await callWebhook(request, requestUrl);

        expect(response.status).toBe(400);
        expectNoStore(response);
        await expect(response.json()).resolves.toEqual({
            error: "Invalid revalidation payload"
        });
        expect(dependencies.resolvePayload).not.toHaveBeenCalled();
        expect(dependencies.triggerRevalidation).not.toHaveBeenCalled();
    });
});

async function callWebhook(request: Request, requestUrl: string): Promise<Response> {
    return POST({
        request,
        url: new URL(requestUrl),
        fetch: dependencies.fetcher
    } as never);
}

function expectNoStore(response: Response) {
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
}

async function callCron(requestUrl: string): Promise<Response> {
    const request = new Request(requestUrl, {
        headers: { Authorization: "Bearer cron-secret" }
    });

    return GET({
        request,
        url: new URL(requestUrl),
        fetch: dependencies.fetcher
    } as never);
}
