import type {
    APIConcertPreview,
    FormattedPerformance
} from "$lib/artkyt/types";
import type { Snippet } from "svelte";

export interface ConcertPreviewLink {
    href: string;
    label: string;
    target?: "_blank";
    rel?: "noopener noreferrer";
}

export interface ConcertPreviewRenderContext {
    concert: APIConcertPreview;
    performance: FormattedPerformance;
    formattedDate: string;
    performanceDateTime: string;
    link?: ConcertPreviewLink;
}

export interface ConcertPreviewItemProps {
    concert: APIConcertPreview;
    linkFormatter: (concert: APIConcertPreview) => string | null;
    bookingUrlLabel?: string;
    newTab?: boolean;
    class?: string;
    children?: Snippet<[ConcertPreviewRenderContext]>;
}

export interface ConcertPreviewItemDesignProps {
    preview: ConcertPreviewRenderContext;
}
