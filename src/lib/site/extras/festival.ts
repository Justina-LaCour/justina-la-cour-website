import type {
    APIArtistsListParams,
    APIConcertPreviewsListParams,
    APIGalleriesListParams
} from "$lib/artkyt/types";

const ARTIST_BIO_PREVIEW_LENGTH = 360;

export interface FestivalConfig {
    activeEdition: string;
    previousEditions: readonly string[];
    sponsorsTag?: string;
    photosTag?: string;
}

export function editionConcertsFilter(
    edition: string
): APIConcertPreviewsListParams {
    return {
        tags: [{ name: edition }],
        getPerformances: "as-separate-concerts",
        sort: "startDateAsc"
    };
}

export function editionArtistsFilter(edition: string): APIArtistsListParams {
    return {
        tags: [{ name: edition }],
        maxContentLength: ARTIST_BIO_PREVIEW_LENGTH
    };
}

export function concertEditionMembershipFilter(
    edition: string,
    concertId: string
): APIConcertPreviewsListParams {
    return {
        ...editionConcertsFilter(edition),
        ids: [concertId]
    };
}

export function editionSponsorsFilter(
    edition: string,
    sponsorsTag: string
): APIGalleriesListParams {
    return {
        tags: [{ name: edition }, { name: sponsorsTag }]
    };
}
