import { actions, load } from "$src/routes/(infrastructure)/actions/forms/+page.server";
import * as formActions from "$lib/server/formActions";
import { describe, expect, it } from "vitest";

describe("form action registry", () => {
    it("exposes only the contact action", () => {
        expect(actions).toEqual({
            contact: formActions.contact
        });
    });

    it("rejects direct page requests with 404", () => {
        try {
            load({} as never);
            throw new Error("Expected the page load to fail");
        } catch (error) {
            expect(error).toMatchObject({ status: 404 });
        }
    });
});
