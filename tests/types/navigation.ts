import type { SiteNavigationItem } from "$lib/site/definition";

const staticItem = {
    route: "/[lang]/bio",
    nameKey: "nav.bio"
} satisfies SiteNavigationItem;

const dynamicItem = {
    route: "/[lang]/[...rest]",
    params: { rest: "featured" },
    nameKey: "nav.featured",
    labelVariables: { section: "featured" }
} satisfies SiteNavigationItem;

// @ts-expect-error Dynamic routes require every non-language route parameter.
const missingParams: SiteNavigationItem = { route: "/[lang]/[...rest]", nameKey: "nav.featured" };

// @ts-expect-error Static routes do not accept route parameters.
const extraParams: SiteNavigationItem = { route: "/[lang]/bio", params: {}, nameKey: "nav.bio" };
