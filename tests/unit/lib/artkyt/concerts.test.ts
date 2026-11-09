import {
    formatPerformanceDateTimeAttribute,
    formatPerformancePrice,
    hasRenderablePerformance,
    parsePerformanceDate,
    performanceMonthKey
} from "$lib/artkyt/concerts";
import type { APIConcertPreview, PerformanceBookingInfo } from "$lib/artkyt/types";
import { describe, expect, it } from "vitest";

function concert(startDate?: string, startTime?: string): APIConcertPreview {
    return {
        id: "concert-1",
        selectedLanguage: "en",
        title: "Concert",
        shortDescription: "",
        url: "",
        startDate: startDate ?? "",
        performances: startDate
            ? [{
                  id: "performance-1",
                  startDate,
                  startTime,
                  venueName: "Hall",
                  cancelled: false,
                  full: false
              }]
            : []
    };
}

describe("concert performance dates", () => {
    it("rejects invalid calendar dates", () => {
        expect(parsePerformanceDate("2026-02-30", "19:30:00")).toBeNull();
    });

    it("derives a month key without parsing an ISO date as UTC", () => {
        expect(performanceMonthKey(concert("2026-01-15", "19:30:00"))).toBe("2026-01");
    });

    it("formats semantic time attributes", () => {
        expect(
            formatPerformanceDateTimeAttribute(
                concert("2026-01-15", "19:30:00").performances[0]
            )
        ).toBe("2026-01-15T19:30:00");
        expect(
            formatPerformanceDateTimeAttribute(
                concert("2026-01-15").performances[0]
            )
        ).toBe("2026-01-15");
    });

    it("filters concerts without a usable first performance", () => {
        expect(hasRenderablePerformance(concert())).toBe(false);
        expect(hasRenderablePerformance(concert("invalid"))).toBe(false);
        expect(hasRenderablePerformance(concert("2026-01-15"))).toBe(true);
    });
});

describe.each([
    { locale: "fr", fixed: "12,50 €", zero: "0,00 €", range: "12,50 € – 20,00 €" },
    { locale: "en", fixed: "€12.50", zero: "€0.00", range: "€12.50 – €20.00" }
])("performance prices in $locale", ({ locale, fixed, zero, range }) => {
    const paid: PerformanceBookingInfo = {
        pricingType: "paid",
        priceMin: 12.5,
        currency: "EUR"
    };

    it("formats a fixed price, equal bounds, and a range", () => {
        expect(formatPerformancePrice(locale, paid)).toBe(fixed);
        expect(formatPerformancePrice(locale, { ...paid, priceMax: 12.5 })).toBe(fixed);
        expect(formatPerformancePrice(locale, { ...paid, priceMax: 20 })).toBe(range);
    });

    it("preserves zero and formats suggested donations", () => {
        expect(formatPerformancePrice(locale, { ...paid, priceMin: 0 })).toBe(zero);
        expect(formatPerformancePrice(locale, {
            pricingType: "donation",
            recommendedPrice: 12.5,
            currency: "EUR"
        })).toBe(fixed);
        expect(formatPerformancePrice(locale, {
            pricingType: "donation",
            recommendedPrice: 0,
            currency: "EUR"
        })).toBe(zero);
    });

    it.each<PerformanceBookingInfo>([
        {},
        { pricingType: "free", priceMin: 10, currency: "EUR" },
        { pricingType: "donation", currency: "EUR" },
        { ...paid, priceMin: undefined },
        { ...paid, priceMin: -1 },
        { ...paid, priceMin: NaN },
        { ...paid, priceMin: Infinity },
        { ...paid, priceMax: -1 },
        { ...paid, priceMax: NaN },
        { ...paid, priceMax: Infinity },
        { ...paid, currency: undefined },
        { ...paid, currency: "" },
        { ...paid, currency: "invalid" },
        { ...paid, currency: "ZZZ" }
    ])("omits absent or invalid amounts: %j", (performance) => {
        expect(formatPerformancePrice(locale, performance)).toBeNull();
    });
});
