import type { APIComposition, ArtkytRecording } from "$lib/artkyt/types";
import type { PlayableRecording } from "$lib/artkyt/constants/externalPlatforms";
import type { Snippet } from "svelte";

export interface CompositionItemLabels {
    premiere: string;
    publisher: string;
    buyScore: string;
    recordings: string;
}

export interface CompositionItemRenderContext {
    composition: APIComposition;
    premiereDate?: string;
    premiereDetails: string;
    buySheetHref?: string;
    coverImageSrc?: string;
    playableRecordings: PlayableRecording<ArtkytRecording>[];
    labels: CompositionItemLabels;
}

export interface CompositionItemProps {
    composition: APIComposition;
    class?: string;
    children?: Snippet<[CompositionItemRenderContext]>;
}

export interface CompositionItemDesignProps {
    preview: CompositionItemRenderContext;
}
