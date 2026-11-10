import {
    createClient,
    createFetchMock,
    jsonResponse
} from "$tests/support/artkyt";
import { describe, expect, it } from "vitest";

describe("ArtkytClient failures", () => {
    it("preserves an HTTP status when the error body is JSON", async () => {
        const fetchMock = createFetchMock(async () =>
            jsonResponse({ error: "Rate limited" }, 429)
        );
        const client = createClient(fetchMock);

        const result = await client.getNewsList({ lang: "en" });

        expect(result).toMatchObject({
            success: false,
            error: { code: "http_429", status: 429 }
        });
    });

    it("preserves an unsuccessful HTTP status without parsing its body", async () => {
        const fetchMock = createFetchMock(async () =>
            new Response("Not JSON", { status: 502 })
        );
        const client = createClient(fetchMock);

        const result = await client.getNewsList({ lang: "en" });

        expect(result).toEqual({
            success: false,
            error: {
                code: "http_502",
                status: 502,
                message: "Artkyt API returned status 502"
            }
        });
    });

    it("reports invalid JSON from a successful response", async () => {
        const fetchMock = createFetchMock(async () =>
            new Response("Not JSON", { status: 200 })
        );
        const client = createClient(fetchMock);

        const result = await client.getNewsList({ lang: "en" });

        expect(result).toMatchObject({
            success: false,
            error: { code: "invalid_response", status: 200 }
        });
    });

    it("normalizes rejected fetch calls as network failures", async () => {
        const fetchMock = createFetchMock(async () => {
            throw new Error("socket closed");
        });
        const client = createClient(fetchMock);

        const result = await client.getNewsList({ lang: "en" });

        expect(result).toEqual({
            success: false,
            error: {
                code: "network",
                message: "Unable to reach the Artkyt API"
            }
        });
    });
});
