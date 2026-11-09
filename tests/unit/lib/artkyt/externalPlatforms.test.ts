import { describe, expect, it } from "vitest";
import {
    getEmbedPlayerUrl,
    isPlayableRecording,
    isRecordingPlatform,
    isSocialPlatform,
    parseExternalId,
    socialPlatformCodeToPlatform,
    type RecordingPlatformCode
} from "$lib/artkyt/constants/externalPlatforms";

describe("external platform guards", () => {
    it("recognizes only configured platform codes", () => {
        expect(isSocialPlatform("instagram")).toBe(true);
        expect(isSocialPlatform("other")).toBe(true);
        expect(isSocialPlatform("unknown")).toBe(false);
        expect(isRecordingPlatform("youtube")).toBe(true);
        expect(isRecordingPlatform("instagram")).toBe(false);
    });

    it("provides positive intrinsic dimensions for every platform icon", () => {
        for (const platform of Object.values(socialPlatformCodeToPlatform)) {
            expect(platform.icon.width).toBeGreaterThan(0);
            expect(platform.icon.height).toBeGreaterThan(0);
        }
    });

    it("recognizes only recordings with a supported safe source", () => {
        expect(isPlayableRecording({
            platform: "youtube",
            url: "https://youtu.be/dQw4w9WgXcQ"
        })).toBe(true);
        expect(isPlayableRecording({
            platform: "instagram",
            url: "https://instagram.com/example"
        })).toBe(false);
        expect(isPlayableRecording({
            platform: "youtube",
            url: "https://youtube.com.example.org/watch?v=dQw4w9WgXcQ"
        })).toBe(false);
    });
});

describe("getEmbedPlayerUrl", () => {
    it.each<[RecordingPlatformCode, string, string]>([
        [
            "youtube",
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://www.youtube.com/embed/dQw4w9WgXcQ"
        ],
        [
            "youtube",
            "https://youtu.be/dQw4w9WgXcQ",
            "https://www.youtube.com/embed/dQw4w9WgXcQ"
        ],
        [
            "spotify",
            "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
            "https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT"
        ],
        [
            "apple-music",
            "https://music.apple.com/ch/album/example/123?i=456",
            "https://embed.music.apple.com/ch/album/example/123?i=456"
        ],
        [
            "bandcamp",
            "https://artist.bandcamp.com/album/example",
            "https://artist.bandcamp.com/album/example"
        ]
    ])("creates a validated %s player URL", (platform, source, expected) => {
        expect(getEmbedPlayerUrl(platform, source)?.href).toBe(expected);
    });

    it("creates a SoundCloud player URL containing the validated source", () => {
        const source = "https://soundcloud.com/artist/track";
        const player = getEmbedPlayerUrl("soundcloud", source);

        expect(player?.origin).toBe("https://w.soundcloud.com");
        expect(player?.pathname).toBe("/player/");
        expect(player?.searchParams.get("url")).toBe(source);
    });

    it.each<[RecordingPlatformCode, string]>([
        ["youtube", "https://youtube.com.example.org/watch?v=dQw4w9WgXcQ"],
        ["youtube", "https://www.youtube.com/watch?v=not-an-id"],
        ["youtube", "https://user@www.youtube.com/watch?v=dQw4w9WgXcQ"],
        ["spotify", "https://open.spotify.com.example.org/track/4cOdK2wGLETKBW3PvgPWqT"],
        ["spotify", "https://open.spotify.com/track/%2F"],
        ["soundcloud", "https://soundcloud.com.example.org/artist/track"],
        ["soundcloud", "https://soundcloud.com/"],
        ["apple-music", "https://music.apple.com.example.org/ch/album/example/123"],
        ["bandcamp", "https://fakebandcamp.com/album/example"],
        ["bandcamp", "javascript:alert(1)"]
    ])("rejects an invalid %s source", (platform, source) => {
        expect(getEmbedPlayerUrl(platform, source)).toBeNull();
        expect(parseExternalId(platform, source)).toBeNull();
    });
});
