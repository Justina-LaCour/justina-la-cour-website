export interface Pagination {
    page: number;
    pageSize: number;
}

export interface PaginationMetadata extends Pagination {
    total: number;
}

export interface PaginatedListPage<T> {
    items: T[];
    pagination: PaginationMetadata;
}

export type ArtkytResourceType =
    | "artists"
    | "bios"
    | "news"
    | "concerts"
    | "compositions"
    | "galleries"
    | "links"
    | "recordings"
    | "repertoire";

export interface ArtkytImage {
    originalQualityUrl: string;
    highQualityUrl?: string;
    thumbnailUrl?: string;
    credits: string;
}

export interface ArtkytRecording {
    platform: string;
    url: string;
}

export interface ArtkytProfileLink {
    id: string;
    kind: string;
    value: string;
}

export interface ArtkytTextOptions {
    format: "plain" | "json" | "html";
}

export interface SingleBioPreview {
    name: string;
    content: string;
    selectedLanguage: string;
}

export interface APINewsItem {
    id: string;
    selectedLanguage: string;
    title: string;
    content: string;
    image?: ArtkytImage;
    publishedAt: string;
}

export interface APIArtist {
    id: string;
    selectedLanguage: string;
    name: string;
    artisticRole?: string;
    bio?: string;
    websiteUrl?: string;
    image?: ArtkytImage;
}

export type APIArtistsListParams = APITaggedParams<{
    maxContentLength?: number;
}>;

export interface PerformanceBookingInfo {
    pricingType?: "paid" | "free" | "donation";
    priceMin?: number;
    priceMax?: number;
    recommendedPrice?: number;
    currency?: string;

    bookingUrl?: string;
    bookingEmail?: string;
    bookingPhone?: string;
}

export interface FormattedPerformance extends PerformanceBookingInfo {
    id: string;

    startDate: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;

    venueName: string;
    venueAddress?: string;

    cancelled: boolean;
    full: boolean;
    notes?: string;
}

export interface APIConcertPreview {
    id: string;

    selectedLanguage: string;
    title: string;
    shortDescription: string;
    url: string;
    image?: ArtkytImage;

    startDate: string;
    endDate?: string;

    venueName?: string;

    program?: object;

    performances: FormattedPerformance[];
}

export interface APIConcert extends APIConcertPreview {
    longDescription: string;
}

export type APITaggedParams<T> = T & {
    tags?: { name: string; value?: string }[];
}

export type PerformancesTreatment = "in-concerts" | "as-separate-concerts";
export type APIConcertPreviewsListParams = APITaggedParams<{
    ids?: string[];
    getPerformances?: PerformancesTreatment;
    includeCancelled?: boolean;
    includeFull?: boolean;
    fromDate?: Date;
    toDate?: Date;
    sort?: "startDateAsc" | "startDateDesc";
}>;

function thisMorning() {
    // Artkyt's date filters currently follow the deployment runtime's local
    // timezone. That boundary is intentionally retained until the site has an
    // explicit artist/event timezone policy.
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

export function upcomingConcertsFilter(): APIConcertPreviewsListParams {
    return {
        getPerformances: "as-separate-concerts",
        fromDate: thisMorning(),
        sort: "startDateAsc"
    }
}

export function pastConcertsFilter(): APIConcertPreviewsListParams {
    return {
        getPerformances: "as-separate-concerts",
        toDate: thisMorning(),
        sort: "startDateDesc"
    }
}

export interface APIGallery {
    id: string;
    selectedLanguage: string;
    title: string;
    description: string;
    images: ArtkytImage[];
}

export type APIGalleriesListParams = APITaggedParams<{}>;

export interface APIRecording {
    id: string;
    selectedLanguage: string;
    title: string;
    description: string;
    platform: string;
    url: string;
    externalId?: string;
}

export interface APIComposition {
    id: string;
    selectedLanguage: string;

    title: string;
    description: string;

    compositionYear: number;
    duration: string;
    instrumentation: string;
    category: string,
    publisher: string,
    buySheetUrl: string;

    hasBeenPremiered: boolean;
    premiereDate?: string,
    premiereLocation?: string,
    premierePerformers?: string,

    coverImage?: ArtkytImage;

    recordings?: ArtkytRecording[];
}

export interface APIRepertoirePiece {
    id: string;
    type: "piece";
    composerName: string;
    compositionYear?: number;
    catalogNumber?: string;
    durationMinutes?: number;
    title: string;
    description?: string;
}

export interface APIRepertoireIntermission {
    id: string;
    type: "intermission";
    durationMinutes?: number;
    label: string;
}

export interface APIRepertoireProgram {
    id: string;
    selectedLanguage: string;
    name: string;
    description?: string;
    durationMinutes?: number;
    computedDurationMinutes: number;
    entries: (APIRepertoirePiece | APIRepertoireIntermission)[];
}

export type APIRepertoireListParams = APITaggedParams<ArtkytTextOptions>;

export interface APIPostContactMessageBody {
    fromName?: string;
    fromEmail?: string;
    fromPhone?: string;
    subject?: string;
    content: string;
}

export interface APISubscribeToNewsletterBody {
    subscriberName?: string;
    subscriberEmail?: string;
    subscriberPhone?: string;
    subscriberAddress?: string;
}
