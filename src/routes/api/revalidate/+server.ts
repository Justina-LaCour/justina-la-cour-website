import {
    ARTKYT_WEBHOOK_SECRET,
    CRON_SECRET,
    ISR_BYPASS_TOKEN,
    SITE_HOSTNAMES
} from "$app/env/private";
import { revalidationMap } from "$lib/config/server/revalidation";
import type { ArtkytResourceType } from "$lib/artkyt/types";
import type { RevalidationPayload } from "$lib/server/revalidationMap";
import { RevalidationPayloadSchema } from "$lib/server/revalidationPayload";
import { getBearerAuthenticationErrorResponseIfInvalid } from "$lib/server/auth";
import type { RequestHandler } from "./$types";
import * as v from "valibot";
import { triggerRevalidation } from "$lib/server/isr";
import { parseSiteHostnames } from "$lib/server/siteHostnames";

function privateJson(data: unknown, init: ResponseInit = {}) {
    const headers = new Headers(init.headers);
    headers.set("Cache-Control", "private, no-store");

    return Response.json(data, { ...init, headers });
}

async function revalidate(
    url: URL,
    payload: RevalidationPayload<ArtkytResourceType>,
    fetchFunction: typeof fetch
) {
    const allowedHostnames = parseSiteHostnames(SITE_HOSTNAMES);

    if (allowedHostnames.size === 0 || !ISR_BYPASS_TOKEN.trim()) {
        return privateJson({ error: "Service unavailable" }, { status: 503 });
    }
    if (!allowedHostnames.has(url.hostname.toLowerCase())) {
        return privateJson({ error: "Forbidden" }, { status: 403 });
    }

    const paths = await revalidationMap.resolvePayload(payload, {
        fetch: fetchFunction
    });

    console.log("Revalidating paths:", paths);
    const result = await triggerRevalidation(
        url.origin,
        paths,
        ISR_BYPASS_TOKEN
    );
    console.log("Revalidation result:", result);

    return privateJson(result, {
        status: result.failed.length === 0 ? 200 : 502
    });
}

export const POST: RequestHandler = async ({ request, url, fetch }) => {
    console.log("Received revalidation request");
    const authenticationError = getBearerAuthenticationErrorResponseIfInvalid(
        request.headers.get("authorization"),
        ARTKYT_WEBHOOK_SECRET
    );

    if (authenticationError) {
        return privateJson(
            { error: authenticationError.error },
            { status: authenticationError.status }
        );
    }

    let payload: RevalidationPayload<ArtkytResourceType>;

    try {
        const body = await request.json();
        payload = v.parse(RevalidationPayloadSchema, body);
    } catch {
        return privateJson(
            { error: "Invalid revalidation payload" },
            { status: 400 }
        );
    }

    return revalidate(url, payload, fetch);
};

export const GET: RequestHandler = async ({ request, url, fetch }) => {
    const authenticationError = getBearerAuthenticationErrorResponseIfInvalid(
        request.headers.get("authorization"),
        CRON_SECRET
    );

    if (authenticationError) {
        return privateJson(
            { error: authenticationError.error },
            { status: authenticationError.status }
        );
    }

    return revalidate(url, { pages: "all" }, fetch);
};
