import { describe, expect, it } from "vitest";
import { formatOptionalLocalizedDate } from "$lib/utils/dates";

describe("formatOptionalLocalizedDate", () => {
    it("returns null for an invalid date", () => {
        expect(formatOptionalLocalizedDate("not-a-date", "en")).toBeNull();
    });

    it("formats a valid date in the requested locale", () => {
        expect(formatOptionalLocalizedDate("2025-02-03T12:00:00Z", "en", {
            timeZone: "UTC",
            year: "numeric",
            month: "short",
            day: "numeric"
        })).toBe("Feb 3, 2025");
    });
});
