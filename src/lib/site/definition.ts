import type { RouteId, RouteParams } from "$app/types";

type LocalizedRouteId = Extract<RouteId, `/[lang]${string}`>;

type LocalizedRouteParams<Route extends LocalizedRouteId> = Omit<
    RouteParams<Route>,
    "lang"
>;

type SiteNavigationItemForRoute<Route extends LocalizedRouteId> =
    keyof LocalizedRouteParams<Route> extends never
        ? {
              route: Route;
              params?: never;
          }
        : {
              route: Route;
              params: LocalizedRouteParams<Route>;
          };

export type SiteNavigationItem = {
    [Route in LocalizedRouteId]: SiteNavigationItemForRoute<Route> & {
        nameKey: string;
        labelVariables?: Readonly<Record<string, unknown>>;
    };
}[LocalizedRouteId];

export interface SiteLink {
    label: string;
    url: string;
}

export interface SiteContact {
    name: string;
    email?: string;
    addressLines?: readonly string[];
    website?: SiteLink;
}

export interface NavigationWordmark {
    src: string;
    alt: string;
    width: number;
    height: number;
}

export interface SiteDefinition<Locale extends string> {
    identity: {
        name: string;
        titleSuffix: string;
        canonicalUrl: string;
        navigationWordmark?: NavigationWordmark;
    };
    locales: {
        supported: readonly Locale[];
        default: Locale;
    };
    navigation: readonly SiteNavigationItem[];
    contact: {
        email: string;
        location?: string;
    };
    legal: {
        websiteManager: Omit<SiteContact, "name"> & { name?: string };
        hostingProvider?: SiteContact;
        domainRegistrar?: SiteContact;
    };
    credits: {
        website?: SiteLink;
        showArtkyt: boolean;
    };
}
