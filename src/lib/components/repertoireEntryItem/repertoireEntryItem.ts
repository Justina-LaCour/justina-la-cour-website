import type { APIRepertoireProgram } from "$lib/artkyt/types";
import type { Snippet } from "svelte";

export type RepertoireEntry = APIRepertoireProgram["entries"][number];

export interface RepertoireEntryItemRenderContext {
    entry: RepertoireEntry;
    details: string;
    duration?: string;
    intermissionLabel: string;
}

export interface RepertoireEntryItemProps {
    entry: RepertoireEntry;
    showPieceDuration: boolean;
    showPieceCatalogNumber: boolean;
    showPieceCompositionYear: boolean;
    class?: string;
    children?: Snippet<[RepertoireEntryItemRenderContext]>;
}

export interface RepertoireEntryItemDesignProps {
    preview: RepertoireEntryItemRenderContext;
}
