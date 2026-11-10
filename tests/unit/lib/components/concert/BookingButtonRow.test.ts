import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import type { APIConcertPreview, FormattedPerformance } from "$lib/artkyt/types";
import BookingButtonRowProbe from "./fixtures/BookingButtonRowProbe.svelte";

const performance: FormattedPerformance = {
    id: "performance",
    startDate: "2027-01-08",
    venueName: "Concert hall",
    cancelled: false,
    full: false,
    bookingUrl: "https://tickets.example/book",
    bookingEmail: "booking@example.com",
    bookingPhone: "+41 21 555 01 23"
};

describe("BookingButtonRow", () => {
    it("renders nothing for missing or unusable contacts", () => {
        const { body } = render(BookingButtonRowProbe, {
            props: {
                performance: {
                    bookingUrl: "javascript:alert(1)",
                    bookingEmail: " ",
                    bookingPhone: " "
                }
            }
        });

        expect(body).not.toContain("<div");
        expect(body).not.toContain("<a");
    });

    it.each([
        { locale: "fr" as const, labels: ["Réserver en ligne", "Réserver par e-mail", "Réserver par téléphone"] },
        { locale: "en" as const, labels: ["Book online", "Book by email", "Book by phone"] }
    ])("renders localized booking actions before the listing link in $locale", ({ locale, labels }) => {
        const concert: APIConcertPreview = {
            id: "concert",
            title: "Concert",
            selectedLanguage: locale,
            shortDescription: "",
            url: "",
            startDate: performance.startDate,
            performances: [performance]
        };
        const { body } = render(BookingButtonRowProbe, {
            props: {
                performance,
                locale,
                preview: {
                    concert,
                    performance,
                    formattedDate: "8 January 2027",
                    performanceDateTime: performance.startDate,
                    link: {
                        href: "/concert",
                        label: "Details"
                    }
                }
            }
        });

        expect(body).toContain('href="/concert"');

        for (const label of labels) {
            expect(body).toContain(label);
            expect(body.indexOf(label)).toBeLessThan(body.indexOf("Details"));
        }
    });
});
