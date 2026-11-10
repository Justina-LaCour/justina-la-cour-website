import {
    failure,
    mapResult,
    ok,
    type BaseError,
    type Result
} from "./result";
import type { SocialPlatformCode } from "./constants/externalPlatforms";
import { DEFAULT_ARTKYT_API_BASE_URL } from "./constants/urls";
import { isValidTimeoutMs } from "$lib/utils/timeouts";
import type {
    APIArtist,
    APIArtistsListParams,
    APIComposition,
    APIConcert,
    APIConcertPreview,
    APIConcertPreviewsListParams,
    APIGalleriesListParams,
    APIGallery,
    APINewsItem,
    APIPostContactMessageBody,
    APIRecording,
    APIRepertoireListParams,
    APIRepertoireProgram,
    APISubscribeToNewsletterBody,
    ArtkytProfileLink,
    ArtkytTextOptions,
    PaginatedListPage,
    Pagination,
    PaginationMetadata,
    SingleBioPreview
} from "./types";

const ONE_HOUR_MS = 60 * 60 * 1000;
const DEFAULT_MAX_CACHE_ENTRIES = 100;
const DEFAULT_TIMEOUT_MS = 10_000;

export type ArtkytErrorCode =
    | "network"
    | "invalid_response"
    | "configuration"
    | `http_${number}`;

export interface ArtkytError extends BaseError<ArtkytErrorCode> {
    status?: number;
}

export interface ArtkytClientConfig {
    profileId: string;
    websiteId?: string;
    baseUrl?: string;
    defaultTtlMs?: number;
    defaultTimeoutMs?: number;
    maxCacheEntries?: number;
    fetch?: typeof globalThis.fetch;
}

export interface ArtkytRequestOptions {
    fetch?: typeof globalThis.fetch;
    signal?: AbortSignal;
    timeoutMs?: number;
    cache?: {
        mode?: "default" | "bypass";
        ttlMs?: number;
    };
}

export interface GetProfileLinksInput {
    platforms?: readonly SocialPlatformCode[];
    pagination?: Partial<Pagination>;
}

export interface LocalizedInput {
    lang: string;
}

export interface LocalizedItemInput extends LocalizedInput {
    id: string;
}

export interface LocalizedTextItemInput extends LocalizedItemInput {
    format?: ArtkytTextOptions["format"];
}

export interface LocalizedListInput extends LocalizedInput {
    pagination?: Partial<Pagination>;
}

export interface GetNewsListInput extends LocalizedListInput {
    maxContentLength?: number;
}

export interface GetConcertsListInput extends LocalizedListInput {
    filter?: Partial<APIConcertPreviewsListParams>;
}

export interface GetArtistsListInput extends LocalizedListInput {
    filter?: Partial<APIArtistsListParams>;
}

export interface GetGalleriesListInput extends LocalizedListInput {
    filter?: Partial<APIGalleriesListParams>;
}

export interface GetRepertoireListInput extends LocalizedListInput {
    filter?: Partial<APIRepertoireListParams>;
}

export interface SubscribeToNewsletterInput {
    newsletterId: string;
    subscription: APISubscribeToNewsletterBody;
}

interface CacheEntry {
    value: Result<unknown, ArtkytError>;
    fetchedAt: number;
}

type PaginatedWireResponse<Key extends string, Item> = {
    pagination: PaginationMetadata;
} & Record<Key, Item[]>;

function appendPagination(
    query: URLSearchParams,
    pagination: Partial<Pagination> = {}
): void {
    query.set("page", String(pagination.page ?? 0));
    query.set("pageSize", String(pagination.pageSize ?? 10));
}

function appendTags(
    query: URLSearchParams,
    tags: APIConcertPreviewsListParams["tags"]
): void {
    if (!tags?.length) return;

    query.set(
        "tags",
        tags
            .map((tag) => (tag.value ? `${tag.name}:${tag.value}` : tag.name))
            .join(";")
    );
}

function appendConcertFilter(
    query: URLSearchParams,
    filter: Partial<APIConcertPreviewsListParams> = {}
): void {
    if (filter.ids?.length) query.set("ids", filter.ids.join(";"));
    appendTags(query, filter.tags);

    if (filter.getPerformances) {
        query.set("getPerformances", filter.getPerformances);
    }
    if (filter.includeCancelled !== undefined) {
        query.set("includeCancelled", String(filter.includeCancelled));
    }
    if (filter.includeFull !== undefined) {
        query.set("includeFull", String(filter.includeFull));
    }
    if (filter.fromDate) query.set("from", filter.fromDate.toISOString());
    if (filter.toDate) query.set("to", filter.toDate.toISOString());
    if (filter.sort) query.set("sort", filter.sort);
}

function configurationFailure(message: string): Result<never, ArtkytError> {
    return failure({
        code: "configuration",
        message
    });
}

export class ArtkytClient {
    readonly #profileBaseUrl: URL;
    readonly #websiteId?: string;
    readonly #defaultTtlMs: number;
    readonly #defaultTimeoutMs: number;
    readonly #maxCacheEntries: number;
    readonly #fetch?: typeof globalThis.fetch;
    readonly #cache = new Map<string, CacheEntry>();
    readonly #pendingGets = new Map<
        string,
        Promise<Result<unknown, ArtkytError>>
    >();
    readonly #latestGets = new Map<
        string,
        Promise<Result<unknown, ArtkytError>>
    >();

    public constructor(config: ArtkytClientConfig) {
        const profileId = config.profileId.trim();

        if (!profileId) {
            throw new TypeError("Artkyt profileId must not be empty");
        }

        const defaultTtlMs = config.defaultTtlMs ?? ONE_HOUR_MS;
        const defaultTimeoutMs = config.defaultTimeoutMs ?? DEFAULT_TIMEOUT_MS;
        const maxCacheEntries = config.maxCacheEntries ?? DEFAULT_MAX_CACHE_ENTRIES;

        if (!Number.isFinite(defaultTtlMs) || defaultTtlMs < 0) {
            throw new TypeError("Artkyt defaultTtlMs must be a non-negative number");
        }
        if (!isValidTimeoutMs(defaultTimeoutMs)) {
            throw new TypeError(
                "Artkyt defaultTimeoutMs must be a positive integer"
            );
        }
        if (!Number.isInteger(maxCacheEntries) || maxCacheEntries < 1) {
            throw new TypeError("Artkyt maxCacheEntries must be a positive integer");
        }

        const baseUrl = new URL(config.baseUrl ?? DEFAULT_ARTKYT_API_BASE_URL);
        baseUrl.pathname = `${baseUrl.pathname.replace(/\/$/, "")}/profile/${encodeURIComponent(profileId)}/`;
        baseUrl.search = "";
        baseUrl.hash = "";

        this.#profileBaseUrl = baseUrl;
        this.#websiteId = config.websiteId?.trim() || undefined;
        this.#defaultTtlMs = defaultTtlMs;
        this.#defaultTimeoutMs = defaultTimeoutMs;
        this.#maxCacheEntries = maxCacheEntries;
        this.#fetch = config.fetch;
    }

    public clearCache(): void {
        this.#cache.clear();
    }

    public async getProfileLinks(
        input: GetProfileLinksInput = {},
        options: ArtkytRequestOptions = {}
    ): Promise<Result<PaginatedListPage<ArtkytProfileLink>, ArtkytError>> {
        const query = new URLSearchParams();
        if (input.platforms?.length) {
            query.set("platforms", input.platforms.join(";"));
        }
        appendPagination(query, input.pagination);

        return this.#getList("links", "links", query, options);
    }

    public async getBio(
        input: LocalizedTextItemInput,
        options: ArtkytRequestOptions = {}
    ): Promise<Result<{ bio: SingleBioPreview }, ArtkytError>> {
        return this.#get(
            `bios/${encodeURIComponent(input.id)}`,
            this.#localizedTextQuery(input),
            options
        );
    }

    public async getNewsList(
        input: GetNewsListInput,
        options: ArtkytRequestOptions = {}
    ): Promise<Result<PaginatedListPage<APINewsItem>, ArtkytError>> {
        const query = this.#localizedListQuery(input);
        if (input.maxContentLength !== undefined) {
            query.set("maxContentLength", String(input.maxContentLength));
        }

        return this.#getList("news", "news", query, options);
    }

    public async getNews(
        input: LocalizedTextItemInput,
        options: ArtkytRequestOptions = {}
    ): Promise<Result<{ news: APINewsItem }, ArtkytError>> {
        return this.#get(
            `news/${encodeURIComponent(input.id)}`,
            this.#localizedTextQuery(input),
            options
        );
    }

    public async getArtistsList(
        input: GetArtistsListInput,
        options: ArtkytRequestOptions = {}
    ): Promise<Result<PaginatedListPage<APIArtist>, ArtkytError>> {
        const query = this.#localizedQuery(input.lang);
        appendTags(query, input.filter?.tags);
        if (input.filter?.maxContentLength !== undefined) {
            query.set(
                "maxContentLength",
                String(input.filter.maxContentLength)
            );
        }
        appendPagination(query, input.pagination);

        return this.#getList("artists", "artists", query, options);
    }

    public async getArtist(
        input: LocalizedTextItemInput,
        options: ArtkytRequestOptions = {}
    ): Promise<Result<{ artist: APIArtist }, ArtkytError>> {
        return this.#get(
            `artists/${encodeURIComponent(input.id)}`,
            this.#localizedTextQuery(input),
            options
        );
    }

    public async getConcertsList(
        input: GetConcertsListInput,
        options: ArtkytRequestOptions = {}
    ): Promise<Result<PaginatedListPage<APIConcertPreview>, ArtkytError>> {
        const query = this.#localizedQuery(input.lang);
        appendConcertFilter(query, input.filter);
        appendPagination(query, input.pagination);

        return this.#getList("concerts", "concerts", query, options);
    }

    public async getConcert(
        input: LocalizedTextItemInput,
        options: ArtkytRequestOptions = {}
    ): Promise<Result<{ concert: APIConcert }, ArtkytError>> {
        return this.#get(
            `concerts/${encodeURIComponent(input.id)}`,
            this.#localizedTextQuery(input),
            options
        );
    }

    public async getCompositionsList(
        input: LocalizedListInput,
        options: ArtkytRequestOptions = {}
    ): Promise<Result<PaginatedListPage<APIComposition>, ArtkytError>> {
        return this.#getList(
            "compositions",
            "compositions",
            this.#localizedListQuery(input),
            options
        );
    }

    public async getComposition(
        input: LocalizedTextItemInput,
        options: ArtkytRequestOptions = {}
    ): Promise<Result<{ composition: APIComposition }, ArtkytError>> {
        return this.#get(
            `compositions/${encodeURIComponent(input.id)}`,
            this.#localizedTextQuery(input),
            options
        );
    }

    public async getGalleriesList(
        input: GetGalleriesListInput,
        options: ArtkytRequestOptions = {}
    ): Promise<Result<PaginatedListPage<APIGallery>, ArtkytError>> {
        const query = this.#localizedQuery(input.lang);
        appendTags(query, input.filter?.tags);
        appendPagination(query, input.pagination);

        return this.#getList("galleries", "galleries", query, options);
    }

    public async getGallery(
        input: LocalizedTextItemInput,
        options: ArtkytRequestOptions = {}
    ): Promise<Result<{ gallery: APIGallery }, ArtkytError>> {
        return this.#get(
            `galleries/${encodeURIComponent(input.id)}`,
            this.#localizedTextQuery(input),
            options
        );
    }

    public async getRecordingsList(
        input: LocalizedListInput,
        options: ArtkytRequestOptions = {}
    ): Promise<Result<PaginatedListPage<APIRecording>, ArtkytError>> {
        return this.#getList(
            "recordings",
            "recordings",
            this.#localizedListQuery(input),
            options
        );
    }

    public async getRecording(
        input: LocalizedTextItemInput,
        options: ArtkytRequestOptions = {}
    ): Promise<Result<{ recording: APIRecording }, ArtkytError>> {
        return this.#get(
            `recordings/${encodeURIComponent(input.id)}`,
            this.#localizedTextQuery(input),
            options
        );
    }

    public async getRepertoireList(
        input: GetRepertoireListInput,
        options: ArtkytRequestOptions = {}
    ): Promise<Result<PaginatedListPage<APIRepertoireProgram>, ArtkytError>> {
        const query = this.#localizedQuery(input.lang);
        query.set("format", input.filter?.format ?? "plain");
        appendTags(query, input.filter?.tags);
        appendPagination(query, input.pagination);

        return this.#getList(
            "repertoire",
            "repertoirePrograms",
            query,
            options
        );
    }

    public async postContactMessage(
        message: APIPostContactMessageBody,
        options: ArtkytRequestOptions = {}
    ): Promise<Result<unknown, ArtkytError>> {
        if (!this.#websiteId) {
            return configurationFailure(
                "Artkyt websiteId is required to post a contact message"
            );
        }

        return this.#request(
            `postContactMessage/${encodeURIComponent(this.#websiteId)}`,
            undefined,
            options,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(message)
            }
        );
    }

    public async subscribeToNewsletter(
        input: SubscribeToNewsletterInput,
        options: ArtkytRequestOptions = {}
    ): Promise<Result<unknown, ArtkytError>> {
        if (!this.#websiteId) {
            return configurationFailure(
                "Artkyt websiteId is required to subscribe to a newsletter"
            );
        }

        return this.#request(
            `subscribeToNewsletter/${encodeURIComponent(input.newsletterId)}/${encodeURIComponent(this.#websiteId)}`,
            undefined,
            options,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input.subscription)
            }
        );
    }

    #localizedQuery(lang: string): URLSearchParams {
        return new URLSearchParams({ lang });
    }

    #localizedTextQuery(input: LocalizedTextItemInput): URLSearchParams {
        const query = this.#localizedQuery(input.lang);
        query.set("format", input.format ?? "plain");
        return query;
    }

    #localizedListQuery(input: LocalizedListInput): URLSearchParams {
        const query = this.#localizedQuery(input.lang);
        appendPagination(query, input.pagination);
        return query;
    }

    #get<T>(
        path: string,
        query: URLSearchParams,
        options: ArtkytRequestOptions
    ): Promise<Result<T, ArtkytError>> {
        return this.#request<T>(path, query, options, { method: "GET" });
    }

    async #getList<Item, Key extends string>(
        path: string,
        itemKey: Key,
        query: URLSearchParams,
        options: ArtkytRequestOptions
    ): Promise<Result<PaginatedListPage<Item>, ArtkytError>> {
        const result = await this.#get<PaginatedWireResponse<Key, Item>>(
            path,
            query,
            options
        );

        return mapResult(result, (value) => ({
            items: value[itemKey],
            pagination: value.pagination
        }));
    }

    async #request<T>(
        path: string,
        query: URLSearchParams | undefined,
        options: ArtkytRequestOptions,
        request: RequestInit
    ): Promise<Result<T, ArtkytError>> {
        const url = new URL(path, this.#profileBaseUrl);
        if (query) url.search = query.toString();

        const isGet = request.method === "GET";
        const cacheKey = url.toString();
        const ttlMs = options.cache?.ttlMs ?? this.#defaultTtlMs;
        const timeoutMs = options.timeoutMs ?? this.#defaultTimeoutMs;

        if (!Number.isFinite(ttlMs) || ttlMs < 0) {
            return configurationFailure(
                "Artkyt cache ttlMs must be a non-negative number"
            );
        }
        if (!isValidTimeoutMs(timeoutMs)) {
            return configurationFailure(
                "Artkyt timeoutMs must be a positive integer"
            );
        }

        if (isGet && options.cache?.mode !== "bypass") {
            const cached = this.#readCache<T>(cacheKey, ttlMs);
            if (cached) return cached;
        }

        const fetchFunction = options.fetch ?? this.#fetch ?? globalThis.fetch;
        if (!fetchFunction) {
            return configurationFailure("No fetch implementation is available");
        }

        const executeRequest = (): Promise<Result<T, ArtkytError>> => {
            return this.#send<T>(
                url,
                request,
                fetchFunction,
                options.signal,
                timeoutMs
            );
        };

        if (!isGet) {
            return executeRequest();
        }

        // A caller-owned signal must retain independent cancellation semantics.
        // Cacheable GETs without one can safely share the underlying public API call.
        const canCoalesce = options.cache?.mode !== "bypass" && !options.signal;
        const pendingKey = `${cacheKey}\0${timeoutMs}`;

        if (canCoalesce) {
            const pendingRequest = this.#pendingGets.get(pendingKey);
            if (pendingRequest) {
                return pendingRequest as Promise<Result<T, ArtkytError>>;
            }
        }

        const requestPromise = executeRequest();
        const untypedRequest = requestPromise as Promise<
            Result<unknown, ArtkytError>
        >;

        this.#latestGets.set(cacheKey, untypedRequest);
        if (canCoalesce) this.#pendingGets.set(pendingKey, untypedRequest);

        try {
            const result = await requestPromise;

            if (
                result.success &&
                this.#latestGets.get(cacheKey) === untypedRequest
            ) {
                this.#writeCache(cacheKey, result);
            }

            return result;
        } finally {
            if (this.#pendingGets.get(pendingKey) === untypedRequest) {
                this.#pendingGets.delete(pendingKey);
            }
            if (this.#latestGets.get(cacheKey) === untypedRequest) {
                this.#latestGets.delete(cacheKey);
            }
        }
    }

    async #send<T>(
        url: URL,
        request: RequestInit,
        fetchFunction: typeof globalThis.fetch,
        callerSignal: AbortSignal | undefined,
        timeoutMs: number
    ): Promise<Result<T, ArtkytError>> {
        let response: Response;

        try {
            const timeoutSignal = AbortSignal.timeout(timeoutMs);
            const signal = callerSignal
                ? AbortSignal.any([callerSignal, timeoutSignal])
                : timeoutSignal;

            response = await fetchFunction(url, { ...request, signal });
        } catch {
            return failure({
                code: "network",
                message: "Unable to reach the Artkyt API"
            });
        }

        if (!response.ok) {
            return failure({
                code: `http_${response.status}`,
                status: response.status,
                message: `Artkyt API returned status ${response.status}`
            });
        }

        let value: T;

        try {
            value = (await response.json()) as T;
        } catch {
            return failure({
                code: "invalid_response",
                status: response.status,
                message: "Artkyt API returned an invalid JSON response"
            });
        }

        return ok(value) as Result<T, ArtkytError>;
    }

    #readCache<T>(
        cacheKey: string,
        ttlMs: number
    ): Result<T, ArtkytError> | undefined {
        const cached = this.#cache.get(cacheKey);
        if (!cached) return undefined;

        if (Date.now() - cached.fetchedAt >= ttlMs) {
            this.#cache.delete(cacheKey);
            return undefined;
        }

        this.#cache.delete(cacheKey);
        this.#cache.set(cacheKey, cached);
        return cached.value as Result<T, ArtkytError>;
    }

    #writeCache<T>(cacheKey: string, value: Result<T, ArtkytError>): void {
        this.#cache.delete(cacheKey);
        this.#cache.set(cacheKey, {
            value: value as Result<unknown, ArtkytError>,
            fetchedAt: Date.now()
        });

        while (this.#cache.size > this.#maxCacheEntries) {
            const oldestKey = this.#cache.keys().next().value;
            if (oldestKey === undefined) break;
            this.#cache.delete(oldestKey);
        }
    }
}
