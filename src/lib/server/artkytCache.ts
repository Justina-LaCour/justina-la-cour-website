// Vercel caches the rendered pages. Always read Artkyt again when a page regenerates.
export const ARTKYT_ISR_CACHE = {
    mode: "bypass"
} as const;
