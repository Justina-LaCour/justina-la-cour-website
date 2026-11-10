import {
    MAX_TIMEOUT_MS,
    isValidTimeoutMs
} from "$lib/utils/timeouts";
import { describe, expect, it } from "vitest";

describe("isValidTimeoutMs", () => {
    it("accepts positive integer timeouts through the safe maximum", () => {
        expect(isValidTimeoutMs(1)).toBe(true);
        expect(isValidTimeoutMs(MAX_TIMEOUT_MS)).toBe(true);
    });

    it.each([
        0,
        -1,
        1.5,
        Number.NaN,
        Number.POSITIVE_INFINITY,
        MAX_TIMEOUT_MS + 1,
        "1000"
    ])("rejects an invalid timeout value: %s", (value) => {
        expect(isValidTimeoutMs(value)).toBe(false);
    });
});
