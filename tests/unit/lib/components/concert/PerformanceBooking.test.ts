import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import type { APIConcert, FormattedPerformance } from "$lib/artkyt/types";
import ConcertDetailsProbe from "./fixtures/ConcertDetailsProbe.svelte";

function renderPerformances(
    performances: Partial<FormattedPerformance>[],
    locale: "fr" | "en" | "de" = "fr"
): string {
    const concert: APIConcert = {
        id: "concert",
        selectedLanguage: locale,
        title: "Concert",
        shortDescription: "",
        longDescription: "",
        url: "",
        startDate: "2026-09-25",
        performances: performances.map((performance, index) => ({
            id: `performance-${index}`,
            startDate: "2026-09-25",
            venueName: `Venue ${index}`,
            cancelled: false,
            full: false,
            ...performance
        }))
    };

    return render(ConcertDetailsProbe, {
        props: { concert, locale }
    }).body;
}

describe.each([
    {
        locale: "de" as const,
        paid: "Kostenpflichtiger Eintritt",
        price: "10,00 €",
        free: "Eintritt frei",
        donation: "Eintritt frei, Spenden willkommen",
        suggested: "Empfohlene Spende: 10,00 €",
        book: "Online reservieren",
        email: "Per E-Mail reservieren",
        phone: "Telefonisch reservieren"
    },
    {
        locale: "fr" as const,
        paid: "Entrée payante",
        price: "10,00 €",
        free: "Gratuit",
        donation: "Entrée libre, collecte",
        suggested: "Don suggéré : 10,00 €",
        book: "Réserver en ligne",
        email: "Réserver par e-mail",
        phone: "Réserver par téléphone"
    },
    {
        locale: "en" as const,
        paid: "Paid admission",
        price: "€10.00",
        free: "Free admission",
        donation: "Free admission, donations welcome",
        suggested: "Suggested donation: €10.00",
        book: "Book online",
        email: "Book by email",
        phone: "Book by phone"
    }
])("performance booking in $locale", ({ locale, paid, price, free, donation, suggested, book, email, phone }) => {
    it("renders admission labels and an optional suggested donation", () => {
        const paidBody = renderPerformances([{
            pricingType: "paid",
            priceMin: 10,
            currency: "EUR"
        }], locale);
        expect(paidBody).toContain(price);
        expect(paidBody).not.toContain(paid);
        expect(renderPerformances([{ pricingType: "free" }], locale)).toContain(free);

        const withoutSuggestion = renderPerformances([{ pricingType: "donation" }], locale);
        expect(withoutSuggestion).toContain(donation);
        expect(withoutSuggestion).not.toContain(suggested.split(":")[0].trim());

        const withSuggestion = renderPerformances([{
            pricingType: "donation",
            recommendedPrice: 10,
            currency: "EUR"
        }], locale);
        expect(withSuggestion).toContain(donation);
        expect(withSuggestion).toContain(suggested);
    });

    it("keeps booking available without pricing", () => {
        const body = renderPerformances([{
            bookingUrl: "https://tickets.example/book",
            bookingEmail: " booking@example.com ",
            bookingPhone: " +41 (21) 555-01-23 "
        }], locale);

        expect(body).toContain(book);
        expect(body).toContain('href="https://tickets.example/book"');
        expect(body).toContain('target="_blank" rel="noopener noreferrer"');
        expect(body).toContain('href="mailto:booking%40example.com"');
        expect(body).toContain('href="tel:%2B41215550123"');
        expect(body).toContain(email);
        expect(body).toContain(phone);
        expect(body).not.toContain(paid);
        expect(body).not.toContain(free);
    });

    it("omits invalid pricing without displaying an admission label", () => {
        const body = renderPerformances([{
            pricingType: "paid",
            priceMin: 10,
            currency: "invalid"
        }], locale);

        expect(body).not.toContain(paid);
        expect(body).not.toContain(price);
        expect(body).not.toContain("invalid");
        expect(body).not.toContain(free);
    });
});

describe("performance booking integration", () => {
    it("keeps different prices and booking links with their performance", () => {
        const body = renderPerformances([
            {
                pricingType: "paid",
                priceMin: 12.5,
                priceMax: 20,
                currency: "EUR",
                bookingUrl: "https://tickets.example/first"
            },
            {
                pricingType: "free",
                bookingUrl: "https://tickets.example/second"
            }
        ]);
        const first = body.slice(body.indexOf("Venue 0"), body.indexOf("Venue 1"));
        const second = body.slice(body.indexOf("Venue 1"));

        expect(first).toContain("12,50 € – 20,00 €");
        expect(first).toContain("https://tickets.example/first");
        expect(first).not.toContain("Entrée payante");
        expect(first).not.toContain("Gratuit");
        expect(second).toContain("Gratuit");
        expect(second).toContain("https://tickets.example/second");
        expect(second).not.toContain("12,50");
    });

    it.each([
        "javascript:alert(1)",
        "data:text/html,unsafe",
        "https://user:password@example.com",
        "/relative-booking",
        "//example.com/book"
    ])("omits unsafe or non-absolute booking websites: %s", (bookingUrl) => {
        expect(renderPerformances([{ bookingUrl }])).not.toContain("<a ");
    });

    it("encodes contact values without allowing extra URI parameters", () => {
        const body = renderPerformances([{
            bookingEmail: "booking@example.com?bcc=someone@example.com",
            bookingPhone: "+41215550123?unexpected=value"
        }]);

        expect(body).toContain('href="mailto:booking%40example.com%3Fbcc%3Dsomeone%40example.com"');
        expect(body).toContain('href="tel:%2B41215550123%3Funexpected%3Dvalue"');
    });

    it("renders escaped notes with preserved line breaks", () => {
        const body = renderPerformances([{
            notes: 'Student rate available.\n<script>alert("unsafe")</script>'
        }]);

        expect(body).toContain("whitespace-pre-wrap");
        expect(body).toContain('Student rate available.\n&lt;script>alert("unsafe")&lt;/script>');
        expect(body).not.toContain("<script>");
    });

    it("omits the booking section when all optional fields are absent or blank", () => {
        const body = renderPerformances([{}, {
            bookingUrl: " ",
            bookingEmail: " ",
            bookingPhone: " ",
            notes: " \n "
        }]);

        expect(body).not.toContain("mt-3 flex flex-col");
        expect(body).not.toContain("<a ");
    });
});
