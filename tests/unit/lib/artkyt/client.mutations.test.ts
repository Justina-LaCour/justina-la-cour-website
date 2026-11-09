import {
    createClient,
    createFetchMock,
    jsonResponse,
    requestUrl
} from "$tests/support/artkyt";
import { describe, expect, it } from "vitest";

describe("ArtkytClient mutations", () => {
    it("posts contact messages without caching them", async () => {
        const fetchMock = createFetchMock(async () =>
            jsonResponse({ accepted: true })
        );
        const client = createClient(fetchMock);
        const message = {
            fromName: "Person",
            fromEmail: "person@example.com",
            content: "Hello"
        };

        await client.postContactMessage(message);
        await client.postContactMessage(message);

        expect(fetchMock).toHaveBeenCalledTimes(2);
        const url = requestUrl(fetchMock);
        expect(url.pathname).toBe(
            "/api/public/profile/profile-id/postContactMessage/website-id"
        );
        expect(fetchMock.mock.calls[0][1]).toMatchObject({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message)
        });
    });

    it("posts newsletter subscriptions to the newsletter and website", async () => {
        const fetchMock = createFetchMock(async () =>
            jsonResponse({ accepted: true })
        );
        const client = createClient(fetchMock);
        const subscription = { subscriberEmail: "person@example.com" };

        await client.subscribeToNewsletter({
            newsletterId: "newsletter/id",
            subscription
        });

        const url = requestUrl(fetchMock);
        expect(url.pathname).toBe(
            "/api/public/profile/profile-id/subscribeToNewsletter/newsletter%2Fid/website-id"
        );
        expect(fetchMock.mock.calls[0][1]).toMatchObject({
            method: "POST",
            body: JSON.stringify(subscription)
        });
    });
});
