import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Action } from "@sveltejs/kit";

const artkyt = vi.hoisted(() => ({
    postContactMessage: vi.fn()
}));
const recaptcha = vi.hoisted(() => ({
    verify: vi.fn(),
    parseHostnames: vi.fn(() => new Set(["example.com"]))
}));

vi.mock("$lib/artkyt", () => ({ artkytClient: artkyt }));
vi.mock("$app/env/private", () => ({
    RECAPTCHA_SECRET_KEY: "recaptcha-secret",
    SITE_HOSTNAMES: "example.com"
}));
vi.mock("$lib/server/recaptcha", () => ({
    verifyRecaptcha: recaptcha.verify
}));
vi.mock("$lib/server/siteHostnames", () => ({
    parseSiteHostnames: recaptcha.parseHostnames
}));

import * as formActions from "$lib/server/formActions";

beforeEach(() => {
    artkyt.postContactMessage.mockReset();
    recaptcha.verify.mockReset();
    recaptcha.parseHostnames.mockClear();

    artkyt.postContactMessage.mockResolvedValue({ success: true, value: {} });
    recaptcha.verify.mockResolvedValue({
        success: true,
        value: { hostname: "example.com" }
    });
});

describe("direct form actions", () => {
    it("maps a valid contact submission without returning PII", async () => {
        const fetcher = vi.fn();
        const result = await contactAction(contactData(), fetcher);

        expect(result).toEqual({ success: true });
        expect(recaptcha.parseHostnames).toHaveBeenCalledWith("example.com");
        expect(artkyt.postContactMessage).toHaveBeenCalledWith({
            fromName: "Person",
            fromEmail: "person@example.com",
            fromPhone: "+41 12 345 67 89",
            subject: "Booking",
            content: "Private message"
        }, { fetch: fetcher });
    });

    it("stops before CAPTCHA and Artkyt after validation failure", async () => {
        const result = await contactAction(new FormData(), vi.fn());

        expect(result).toMatchObject({
            status: 422,
            data: {
                success: false,
                code: "validation",
                fields: {
                    name: "required",
                    email: "required",
                    message: "required",
                    captchaToken: "required"
                }
            }
        });
        expect(recaptcha.verify).not.toHaveBeenCalled();
        expect(artkyt.postContactMessage).not.toHaveBeenCalled();
    });

    it.each([
        ["rejected", 400, "captcha_rejected"],
        ["hostname_mismatch", 400, "captcha_rejected"],
        ["network", 502, "captcha_unavailable"],
        ["http", 502, "captcha_unavailable"],
        ["invalid_response", 502, "captcha_unavailable"],
        ["configuration", 503, "configuration"]
    ])("maps CAPTCHA %s failures", async (code, status, publicCode) => {
        recaptcha.verify.mockResolvedValue({
            success: false,
            error: { code, message: "private detail" }
        });

        const result = await contactAction(contactData(), vi.fn());

        expect(result).toMatchObject({
            status,
            data: { success: false, code: publicCode }
        });
        expect(artkyt.postContactMessage).not.toHaveBeenCalled();
    });

    it.each([
        ["network", 502, "upstream"],
        ["configuration", 503, "configuration"]
    ])("maps Artkyt %s failures", async (code, status, publicCode) => {
        artkyt.postContactMessage.mockResolvedValue({
            success: false,
            error: { code, message: "private detail" }
        });

        const result = await contactAction(contactData(), vi.fn());

        expect(result).toMatchObject({
            status,
            data: { success: false, code: publicCode }
        });
    });

    it("maps unexpected errors without returning the thrown object", async () => {
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        artkyt.postContactMessage.mockRejectedValue(
            new Error("private exception")
        );

        const result = await contactAction(contactData(), vi.fn());

        expect(result).toMatchObject({
            status: 500,
            data: { success: false, code: "internal" }
        });
        expect(JSON.stringify(result)).not.toContain("private exception");
        expect(log).toHaveBeenCalledOnce();
        expect(log).toHaveBeenCalledWith(
            "Contact form action failed",
            expect.any(Error)
        );
    });
});

function contactData(): FormData {
    const data = new FormData();
    data.set("name", "Person");
    data.set("email", "person@example.com");
    data.set("phone", "+41 12 345 67 89");
    data.set("subject", "Booking");
    data.set("message", "Private message");
    data.set("captchaToken", "captcha-token");
    return data;
}

async function contactAction(data: FormData, fetcher: typeof fetch) {
    return formActions.contact(createActionEvent(data, fetcher));
}

function createActionEvent(
    data: FormData,
    fetcher: typeof fetch
): Parameters<Action>[0] {
    const event = {
        request: new Request("https://example.com/actions/forms", {
            method: "POST",
            body: data
        }),
        fetch: fetcher
    } satisfies Pick<Parameters<Action>[0], "request" | "fetch">;

    return event as Parameters<Action>[0];
}
