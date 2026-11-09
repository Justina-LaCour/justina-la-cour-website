import {
    concertEditionMembershipFilter,
    editionArtistsFilter,
    editionConcertsFilter,
    editionSponsorsFilter
} from "$lib/site/extras/festival";
import { describe, expect, it } from "vitest";

describe("festival Artkyt filters", () => {
    it("builds a chronological edition programme filter", () => {
        expect(editionConcertsFilter("2025")).toEqual({
            tags: [{ name: "2025" }],
            getPerformances: "as-separate-concerts",
            sort: "startDateAsc"
        });
    });

    it("requests short biography previews for an edition's artists", () => {
        expect(editionArtistsFilter("2027")).toEqual({
            tags: [{ name: "2027" }],
            maxContentLength: 360
        });
    });

    it("combines edition membership with a concert id", () => {
        expect(concertEditionMembershipFilter("summer", "concert/id")).toEqual({
            tags: [{ name: "summer" }],
            getPerformances: "as-separate-concerts",
            sort: "startDateAsc",
            ids: ["concert/id"]
        });
    });

    it("requires both the edition and sponsor tags", () => {
        expect(editionSponsorsFilter("2024", "Sponsors")).toEqual({
            tags: [{ name: "2024" }, { name: "Sponsors" }]
        });
    });
});
