import { redirect } from "@sveltejs/kit";
import { site } from "$lib/config/config";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    redirect(307, `/${site.locales.default}`);
};
