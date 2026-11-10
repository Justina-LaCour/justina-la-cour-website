import { safeExternalHttpUrl } from "$lib/utils/urls";
import type { ArtkytRecording } from "../types";

export const recordingPlatforms = [
    "youtube",
    "soundcloud",
    "spotify",
    "bandcamp",
    "apple-music",
] as const;

export const externalPlatforms = [
    "website",
    "instagram",
    "facebook",
    "x",
    "linkedin",
    "tiktok",
    ...recordingPlatforms,
    "other"
] as const;

export type RecordingPlatformCode = typeof recordingPlatforms[number];
export type SocialPlatformCode = typeof externalPlatforms[number];

export function isRecordingPlatform(
    value: string
): value is RecordingPlatformCode {
    return recordingPlatforms.includes(value as RecordingPlatformCode);
}

export type PlayableRecording<T extends ArtkytRecording> = T & {
    platform: RecordingPlatformCode;
};

export function isPlayableRecording<T extends ArtkytRecording>(
    recording: T
): recording is PlayableRecording<T> {
    return (
        isRecordingPlatform(recording.platform) &&
        getEmbedPlayerUrl(recording.platform, recording.url) !== null
    );
}

export function isSocialPlatform(value: string): value is SocialPlatformCode {
    return externalPlatforms.includes(value as SocialPlatformCode);
}

export interface SocialPlatformIcon {
    url: string;
    width: number;
    height: number;
}

export interface SocialPlatform {
    code: SocialPlatformCode;
    label: string;
    icon: SocialPlatformIcon;
}

export const socialPlatformCodeToPlatform: Record<SocialPlatformCode, SocialPlatform> = {
    website: {
        code: "website",
        label: "Website",
        icon: { url: "/icons/externalPlatforms/website.svg", width: 800, height: 800 }
    },
    instagram: {
        code: "instagram",
        label: "Instagram",
        icon: { url: "/icons/externalPlatforms/instagram.svg", width: 132, height: 132 }
    },
    facebook: {
        code: "facebook",
        label: "Facebook",
        icon: { url: "/icons/externalPlatforms/facebook.svg", width: 667, height: 667 }
    },
    x: {
        code: "x",
        label: "Twitter / X",
        icon: { url: "/icons/externalPlatforms/x.svg", width: 300, height: 271 }
    },
    youtube: {
        code: "youtube",
        label: "YouTube",
        icon: { url: "/icons/externalPlatforms/youtube.svg", width: 2857, height: 2000 }
    },
    linkedin: {
        code: "linkedin",
        label: "LinkedIn",
        icon: { url: "/icons/externalPlatforms/linkedin.svg", width: 72, height: 72 }
    },
    tiktok: {
        code: "tiktok",
        label: "TikTok",
        icon: { url: "/icons/externalPlatforms/tiktok.svg", width: 96, height: 96 }
    },
    soundcloud: {
        code: "soundcloud",
        label: "SoundCloud",
        icon: { url: "/icons/externalPlatforms/soundcloud.svg", width: 152, height: 151 }
    },
    spotify: {
        code: "spotify",
        label: "Spotify",
        icon: { url: "/icons/externalPlatforms/spotify.svg", width: 496, height: 512 }
    },
    bandcamp: {
        code: "bandcamp",
        label: "Bandcamp",
        icon: { url: "/icons/externalPlatforms/bandcamp.svg", width: 683, height: 683 }
    },
    "apple-music": {
        code: "apple-music",
        label: "Apple Music",
        icon: { url: "/icons/externalPlatforms/appleMusic.svg", width: 361, height: 361 }
    },
    other: {
        code: "other",
        label: "Other",
        icon: { url: "/icons/externalPlatforms/other.svg", width: 1, height: 1 }
    }
};

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const SPOTIFY_ID_PATTERN = /^[A-Za-z0-9]+$/;
const SPOTIFY_KINDS = new Set(["track", "playlist", "album", "artist"]);

function hasHostname(url: URL, ...hostnames: string[]): boolean {
    return hostnames.includes(url.hostname.toLowerCase());
}

function isBandcampHostname(hostname: string): boolean {
    const normalized = hostname.toLowerCase();
    return normalized === "bandcamp.com" || normalized.endsWith(".bandcamp.com");
}

function youtubeId(url: URL): string | null {
    if (hasHostname(url, "youtu.be")) {
        const id = url.pathname.split("/").filter(Boolean)[0];
        return id && YOUTUBE_ID_PATTERN.test(id) ? id : null;
    }

    if (!hasHostname(url, "youtube.com", "www.youtube.com")) return null;

    const parts = url.pathname.split("/").filter(Boolean);
    const id = url.pathname === "/watch"
        ? url.searchParams.get("v")
        : ["embed", "shorts", "live"].includes(parts[0])
            ? parts[1]
            : null;

    return id && YOUTUBE_ID_PATTERN.test(id) ? id : null;
}

function spotifyId(url: URL): string | null {
    if (!hasHostname(url, "open.spotify.com")) return null;

    const parts = url.pathname.split("/").filter(Boolean);
    const kindIndex = parts.findIndex((part) => SPOTIFY_KINDS.has(part));
    const kind = parts[kindIndex];
    const id = parts[kindIndex + 1];

    if (!kind || !id || !SPOTIFY_ID_PATTERN.test(id)) return null;
    return `${kind}/${id}`;
}

export function parseExternalId(
    platform: RecordingPlatformCode,
    source: string
): string | null {
    const url = safeExternalHttpUrl(source);
    if (!url) return null;

    switch (platform) {
        case "youtube":
            return youtubeId(url);
        case "spotify":
            return spotifyId(url);
        case "soundcloud":
            return hasHostname(url, "soundcloud.com", "www.soundcloud.com") &&
                url.pathname !== "/"
                ? url.pathname.slice(1)
                : null;
        case "apple-music":
            return hasHostname(url, "music.apple.com") && url.pathname !== "/"
                ? url.pathname.slice(1)
                : null;
        case "bandcamp":
            return isBandcampHostname(url.hostname) && url.pathname !== "/"
                ? url.href
                : null;
    }
}

export function getEmbedPlayerUrl(
    platform: RecordingPlatformCode,
    source: string
): URL | null {
    const url = safeExternalHttpUrl(source);
    if (!url) return null;

    switch (platform) {
        case "youtube": {
            const id = youtubeId(url);
            return id ? new URL(`/embed/${id}`, "https://www.youtube.com") : null;
        }
        case "spotify": {
            const id = spotifyId(url);
            return id ? new URL(`/embed/${id}`, "https://open.spotify.com") : null;
        }
        case "soundcloud": {
            if (
                !hasHostname(url, "soundcloud.com", "www.soundcloud.com") ||
                url.pathname === "/"
            ) {
                return null;
            }

            const embedUrl = new URL("https://w.soundcloud.com/player/");
            embedUrl.searchParams.set("url", url.href);
            return embedUrl;
        }
        case "apple-music": {
            if (!hasHostname(url, "music.apple.com") || url.pathname === "/") {
                return null;
            }

            const embedUrl = new URL(url.pathname, "https://embed.music.apple.com");
            embedUrl.search = url.search;
            return embedUrl;
        }
        case "bandcamp":
            return isBandcampHostname(url.hostname) && url.pathname !== "/"
                ? url
                : null;
    }
}
