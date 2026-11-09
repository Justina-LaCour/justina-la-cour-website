import type { APIArtist } from "$lib/artkyt/types";
import { safeHttpHref } from "$lib/utils/urls";
import type { Snippet } from "svelte";

export type ArtistCardDesignId =
    | "portrait"
    | "editorial"
    | "cinematic"
    | "nocturne"
    | "medallion"
    | "programme";

export interface ArtistCardRenderContext {
    artist: APIArtist;
    imageSrc?: string;
    imageLowresSrc?: string;
    initials: string;
    websiteHref?: string;
    websiteLabel: string;
    readMoreLabel: string;
}

export interface ArtistCardProps {
    artist: APIArtist;
    class?: string;
    children?: Snippet<[ArtistCardRenderContext]>;
}

export interface ArtistCardDesignProps {
    preview: ArtistCardRenderContext;
}

export function artistInitials(name: string): string {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "?";

    const initials = words.length === 1
        ? words[0].slice(0, 2)
        : `${words[0][0]}${words.at(-1)?.[0] ?? ""}`;

    return initials.toLocaleUpperCase();
}

export function createArtistCardPreview(
    artist: APIArtist,
    websiteLabel: string,
    readMoreLabel = "Read more"
): ArtistCardRenderContext {
    return {
        artist,
        imageSrc:
            artist.image?.highQualityUrl ?? artist.image?.originalQualityUrl,
        imageLowresSrc: artist.image?.thumbnailUrl,
        initials: artistInitials(artist.name),
        websiteHref: safeHttpHref(artist.websiteUrl) ?? undefined,
        websiteLabel,
        readMoreLabel
    };
}
