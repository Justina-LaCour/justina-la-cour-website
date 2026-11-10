import * as formActions from "$lib/server/formActions";
import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const actions: Actions = {
    contact: formActions.contact
};

export const load: PageServerLoad = () => {
    throw error(404, "Not found");
};
