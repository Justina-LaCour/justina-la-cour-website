import type { APINewsItem } from "$lib/artkyt/types";
import type { Snippet } from "svelte";

export interface NewsCardRenderContext {
    news: APINewsItem;
    href: string;
    publishedAt?: string;
    imageSrc?: string;
    imageLowresSrc?: string;
    excerpt: string;
    readMoreLabel: string;
}

export interface NewsCardProps {
    news: APINewsItem;
    class?: string;
    children?: Snippet<[NewsCardRenderContext]>;
}

export interface NewsCardDesignProps {
    preview: NewsCardRenderContext;
}
