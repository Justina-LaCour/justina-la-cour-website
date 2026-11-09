import { resolve } from "$app/paths";
import type { RouteId, RouteParams } from "$app/types";
import { unique } from "$lib/utils/array";

type Awaitable<T> = T | Promise<T>;

export type ResourceSelection = readonly string[] | "all";

export type RevalidationPayload<Resource extends string> =
    | { pages: "all" }
    | {
          resources: Partial<Record<Resource, ResourceSelection>>;
      };

export interface RevalidationMapResolveOptions {
    fetch?: typeof fetch;
}

export interface RevalidationRouteContext {
    fetch: typeof fetch;

    localizeAndResolve<Route extends RouteId>(
        route: Route,
        params: Omit<RouteParams<Route>, "lang">
    ): string[];
}

export interface RevalidationResolverContext extends RevalidationRouteContext {
    /**
     * Resolves every ISR route. The result is memoized for the current
     * `resolve` operation.
     */
    allRoutes(): Promise<string[]>;
}

export type RevalidationResolver = (
    selection: ResourceSelection,
    context: RevalidationResolverContext
) => Awaitable<readonly string[]>;

export interface RevalidationMapDefinition<Resource extends string> {
    supportedLanguages: readonly string[];
    allRoutes(
        context: RevalidationRouteContext
    ): Awaitable<readonly string[]>;
    resolvers: Partial<Record<Resource, RevalidationResolver>>;
}

export class RevalidationMap<Resource extends string> {
    readonly #supportedLanguages: readonly string[];
    readonly #allRoutes: RevalidationMapDefinition<Resource>["allRoutes"];
    readonly #resolvers: Partial<Record<Resource, RevalidationResolver>>;

    constructor({
        supportedLanguages,
        allRoutes,
        resolvers
    }: RevalidationMapDefinition<Resource>) {
        this.#supportedLanguages = supportedLanguages;
        this.#allRoutes = allRoutes;
        this.#resolvers = resolvers;
    }

    async resolve(
        resources: Partial<Record<Resource, ResourceSelection>>,
        options: RevalidationMapResolveOptions = {}
    ): Promise<string[]> {
        const baseContext = this.#createBaseContext(options);
        let allRoutesPromise: Promise<string[]> | undefined;

        const context: RevalidationResolverContext = {
            ...baseContext,
            allRoutes: () => {
                allRoutesPromise ??= this.#resolveAllRoutes(baseContext);
                return allRoutesPromise;
            }
        };

        const results = await Promise.all(
            Object.entries(resources).map(async ([resource, selection]) => {
                const resourceSelection = selection as ResourceSelection | undefined;

                if (!resourceSelection || isResourceSelectionEmpty(resourceSelection)) {
                    return [];
                }

                const resolver = this.#resolvers[resource as Resource];
                if (!resolver) {
                    return [];
                }

                return resolver(resourceSelection, context);
            })
        );

        return unique(results.flat());
    }

    async resolveAll(
        options: RevalidationMapResolveOptions = {}
    ): Promise<string[]> {
        return this.#resolveAllRoutes(this.#createBaseContext(options));
    }

    async resolvePayload(
        payload: RevalidationPayload<Resource>,
        options: RevalidationMapResolveOptions = {}
    ): Promise<string[]> {
        if ("pages" in payload) {
            return this.resolveAll(options);
        }

        return this.resolve(payload.resources, options);
    }

    #createBaseContext(
        options: RevalidationMapResolveOptions
    ): RevalidationRouteContext {
        return {
            fetch: options.fetch ?? globalThis.fetch,

            localizeAndResolve: (route, params) => {
                return this.#supportedLanguages.map((lang) =>{
                    // @ts-expect-error SvelteKit cannot correlate a generic route with its params.
                    return resolve(route, {
                        ...params,
                        lang
                    });
                });
            }
        };
    }

    async #resolveAllRoutes(
        context: RevalidationRouteContext
    ): Promise<string[]> {
        return unique(await this.#allRoutes(context));
    }
}

function isResourceSelectionEmpty(selection: ResourceSelection): boolean {
    return selection !== "all" && selection.length === 0;
}

export function includesResource(
    selection: ResourceSelection,
    expectedId: string
): boolean {
    return selection === "all" || selection.includes(expectedId);
}
