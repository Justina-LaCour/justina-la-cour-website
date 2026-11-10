import { ArtkytClient } from "$lib/artkyt/client";
import { vi, type Mock } from "vitest";

export const API_BASE_URL = "https://api.example.test/api/public";
export const PAGINATION = { page: 0, pageSize: 10, total: 1 };

export function jsonResponse(value: unknown, status = 200): Response {
    return new Response(JSON.stringify(value), {
        status,
        headers: { "Content-Type": "application/json" }
    });
}

export function paginatedResponse(key: string, items: unknown[]): Response {
    return jsonResponse({
        [key]: items,
        pagination: PAGINATION
    });
}

export type FetchMock = Mock<typeof globalThis.fetch>;

export function createFetchMock(
    implementation: typeof globalThis.fetch
): FetchMock {
    return vi.fn(implementation);
}

export function createUnexpectedFetchMock(): FetchMock {
    return createFetchMock(async () => {
        throw new Error("Unexpected fetch request");
    });
}

export function requestUrl(
    fetchMock: FetchMock,
    index = 0
): URL {
    return new URL(String(fetchMock.mock.calls[index][0]));
}

export function createClient(
    fetchMock: FetchMock,
    overrides: Partial<ConstructorParameters<typeof ArtkytClient>[0]> = {}
): ArtkytClient {
    return new ArtkytClient({
        profileId: "profile-id",
        websiteId: "website-id",
        baseUrl: API_BASE_URL,
        fetch: fetchMock,
        ...overrides
    });
}
